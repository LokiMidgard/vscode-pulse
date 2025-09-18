import { battery as batteryInfo } from 'systeminformation';
import { workspace } from 'vscode';
import { ExtensionConfiguration } from '../interfaces';

export class utils {
  static getConfig(): ExtensionConfiguration {
    const workspaceConfig = workspace.getConfiguration('pulse');

    return {
      swap: workspaceConfig.get('swap') as boolean,
      clockFormat: workspaceConfig.get('clock.format') as string,
      clockInterval: workspaceConfig.get('clock.interval') as number,
      batteryInterval: workspaceConfig.get('battery.interval') as number,
      batteryWarning: workspaceConfig.get('battery.warning') as number,
      batteryError: workspaceConfig.get('battery.error') as number
    };
  }

  static async batteryCheck(): Promise<boolean> {
    return (await batteryInfo()).hasBattery;
  }
}