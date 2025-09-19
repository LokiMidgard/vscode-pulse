import moment = require('moment');
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { Position } from '../constants';
import { ExtensionConfiguration } from '../interfaces';
import { utils } from './utils';

export class Clock {
  private config: ExtensionConfiguration;
  private clock: StatusBarItem;
  private interval: NodeJS.Timeout;
  private disposed: boolean = false;

  constructor(currentConfig: ExtensionConfiguration) {
    this.config = currentConfig;
    this.clock = this.createClock();
    this.interval = setTimeout(() => { }, 0) as unknown as NodeJS.Timeout;

    this.startClock();
    this.clock.show();
  }

  getClock(): StatusBarItem {
    return this.clock;
  }

  updateConfig() {
    this.config = utils.getConfig();
  }

  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.clock.dispose();
    clearInterval(this.interval);
  }

  redraw() {
    this.clock.show();
  }

  private createClock(): StatusBarItem {
    return window.createStatusBarItem(StatusBarAlignment.Right, this.config.swap ? Position.LEFT : Position.RIGHT);
  }

  private startClock() {
    const updateClock = () => {
      if (this.disposed) {
        return;
      }
      let now = moment();
      this.clock.text = now.format(this.config.clockFormat);
      let nextTick;
      // Prüfe, ob Sekunden im Format enthalten sind
      if (this.config.clockFormat.includes('s')) {
        // Nächstes Update nach Ablauf der aktuellen Sekunde
        nextTick = 1000 - now.milliseconds();
      } else {
        // Nächstes Update nach Ablauf der aktuellen Minute
        nextTick = (60 - now.seconds()) * 1000 - now.milliseconds();
      }
      this.interval = setTimeout(updateClock, nextTick);
    };
    updateClock();
  }
}