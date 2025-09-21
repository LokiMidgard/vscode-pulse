import { ExtensionContext, workspace, window as vscodeWndow } from 'vscode';
import { Battery } from './pulse/battery';
import { Clock } from './pulse/clock';
import { utils } from './pulse/utils';

export function activate(context: ExtensionContext) {
  const outputChannel = vscodeWndow.createOutputChannel('Pulse');
  context.subscriptions.push({
    dispose: () => {
      outputChannel.appendLine('Pulse extension deactivated.');
      outputChannel.dispose();
    }
  });
  outputChannel.appendLine('Pulse extension activated.');

  try {

    outputChannel.appendLine('Initializing Clock...');
    const pulseClock = new Clock(utils.getConfig());
    context.subscriptions.push(pulseClock);
    context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
      pulseClock.updateConfig();
    }));
  } catch (e) {
    outputChannel.appendLine('Error initializing Clock: ' + String(e));
    outputChannel.appendLine('Clock could not be started. Please check your configuration.');
  }

  try {

    outputChannel.appendLine('Checking for battery...');
    utils.batteryCheck().then((val) => {
      if (val) {
        outputChannel.appendLine('Battery detected. Initializing Battery...');
        const pulseBattery = new Battery(utils.getConfig(), outputChannel);
        context.subscriptions.push(pulseBattery);
        context.subscriptions.push(workspace.onDidChangeConfiguration(() => {
          pulseBattery.updateConfig();
        }));
      } else {
        outputChannel.appendLine('No battery detected. Battery status will not be shown.');
      }
    });
  } catch (e) {
    outputChannel.appendLine('Error initializing Battery: ' + String(e));
    outputChannel.appendLine('Battery could not be started. Please check your configuration.');
  }

}

export function deactivate() {
  return null;
}