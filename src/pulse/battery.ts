import { battery as batteryInfo, powerShellStart, powerShellRelease } from 'systeminformation';
import { StatusBarAlignment, StatusBarItem, window, ThemeColor, OutputChannel } from 'vscode';
import { BatteryLevel, Position } from '../constants';
import { ExtensionConfiguration } from '../interfaces';
import { utils } from './utils';

export class Battery {
  private config: ExtensionConfiguration;
  private battery: StatusBarItem;
  private interval: NodeJS.Timeout;
  private disposed: boolean;
  private powershellError: boolean;
  private outputChannel: OutputChannel;

  constructor(currentConfig: ExtensionConfiguration, outputChannel: OutputChannel) {
    this.powershellError = false;
    this.config = currentConfig;
    this.battery = this.createBattery();
    this.interval = setTimeout(() => { }, 0);
    this.disposed = false;
    this.outputChannel = outputChannel;
    this.updateBattery();
    try {
      powerShellStart();
    } catch (e) {
      this.outputChannel.appendLine('Error starting PowerShell session: ' + String(e));
      this.powershellError = true;
      this.outputChannel.appendLine('PowerShell session could not be started. Battery status accuracy will be reduced to save performance.');
    }
    this.battery.show();
  }

  getClock(): StatusBarItem {
    return this.battery;
  }

  updateConfig() {
    this.config = utils.getConfig();
    this.redraw();
  }

  dispose() {
    this.battery.dispose();
    clearInterval(this.interval);
    this.disposed = true;
    powerShellRelease();
  }

  redraw() {
    this.battery.show();
  }

  private createBattery(): StatusBarItem {
    return window.createStatusBarItem(StatusBarAlignment.Right, this.config.swap ? Position.RIGHT : Position.LEFT);
  }

  private updateBattery(): void {
    batteryInfo().then((data) => {
      if (this.disposed) return;
      try {
        const level = Math.min(Math.max(data.percent, BatteryLevel.MIN), BatteryLevel.MAX);
        const charging = data.isCharging ? '+' : '';
        this.battery.text = `${charging}${level}%`;
        if ((this.config.batteryError && level <= (this.config.batteryError ?? 0))) {
          this.battery.color = new ThemeColor('statusBarItem.errorForeground');
          this.battery.backgroundColor = new ThemeColor('statusBarItem.errorBackground');
        } else if ((this.config.batteryWarning && level <= (this.config.batteryWarning ?? 0))) {
          this.battery.color = new ThemeColor('statusBarItem.warningForeground');
          this.battery.backgroundColor = new ThemeColor('statusBarItem.warningBackground');
        } else {
          this.battery.color = undefined;
          this.battery.backgroundColor = undefined;
        }
      } catch (e) {
        // log error but do not crash
        this.outputChannel.appendLine('Error updating battery status: ' + String(e));
        this.battery.text = `$(alert)`;
        this.battery.color = new ThemeColor('statusBarItem.errorForeground');
        this.battery.backgroundColor = new ThemeColor('statusBarItem.errorBackground');
      }

      this.interval = setTimeout(() => {
        this.updateBattery();
      }, this.powershellError ? 2 * 60 * 1000 : this.config.batteryInterval);
    });
  }
}