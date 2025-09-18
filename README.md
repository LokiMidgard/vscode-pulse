
# Pulse

> **Hinweis:** Dies ist ein Fork der Extension [vscode-lifeline](https://github.com/hugginsio/vscode-lifeline) von hugginsio.
>
> Unlike the original, this version runs on the local host, so it will show you the battery of your device instead of the remote host.

A Visual Studio Code extensions that shows a clock and the current battery state in the status bar.



## Features

Pulse presents the time and battery level of your laptop in the bottom right of the status bar. It tries to always be the the rightmost item. By default, it displays the time on the right and the battery on the left. You can swap the positioning (and the time format) in the extension settings. It contains no styling of its own, so the status bar items will always match your theme of choice.

Pulse will also indicate if laptop is charging. It will not show the battery status at all if one is not detected.

## Preview

| Device unplugged | Device charging |
| - | - |
| ![Device unplugged](./media/device-unplugged.png) | ![Device charging](./media/device-charging.png) |

## Configuration

### `pulse.battery.interval`

Set the polling interval for the battery in ms. Ignored if device has no battery. By default, set to 3000ms.

### `pulse.clock.format`

Sets the display format for the clock. By default, set to `h:mm:ss A`.

### `pulse.clock.interval`

Set the polling interval for the clock in ms. By default, set to 1000ms.

### `pulse.swap`

Swap the display order of the battery and clock. Ignored if device has no battery. By default, set to `false`.

### `pulse.battery.performance`

To improve battery performance, the battery level should remain between 40 and 80%. By default, set to `false`.
