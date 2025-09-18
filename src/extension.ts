import { ExtensionContext, workspace } from 'vscode';
import { Battery } from './pulse/battery';
import { Clock } from './pulse/clock';
import { utils } from './pulse/utils';

export function activate(context: ExtensionContext) {
  const pulseClock = new Clock(utils.getConfig());
  const pulseBattery = new Battery(utils.getConfig());
  context.subscriptions.push(pulseClock);
  
  utils.batteryCheck().then((val) => {
    if (val) {
      context.subscriptions.push(pulseBattery);
    } else {
      pulseBattery.dispose();
    }
  });
  
  context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
    pulseClock.updateConfig();
    pulseBattery.updateConfig();
  }));
}

export function deactivate() {
  return null; 
}