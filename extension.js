import GLib from 'gi://GLib';
import Shell from 'gi://Shell';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { setLogging, setLogFn, journal } from './utils.js'

const DateMenu = Main.panel.statusArea.dateMenu;

export default class NotificationThemeExtension extends Extension {
  enable() {
    setLogFn((msg, error = false) => {
      let level;
      if (error) {
        level = GLib.LogLevelFlags.LEVEL_CRITICAL;
      } else {
        level = GLib.LogLevelFlags.LEVEL_MESSAGE;
      }

      GLib.log_structured(
        'fix-calendar-by-blueray453',
        level,
        {
          MESSAGE: `${msg}`,
          SYSLOG_IDENTIFIER: 'fix-calendar-by-blueray453',
          CODE_FILE: GLib.filename_from_uri(import.meta.url)[0]
        }
      );
    });

    setLogging(true);

    // journalctl -f -o cat SYSLOG_IDENTIFIER=fix-calendar-by-blueray453
    journal(`Enabled`);

    DateMenu._calendar._weekStart = 6; // Saturday
    DateMenu._calendar._onSettingsChange();
  }

  disable() {
    DateMenu._calendar._weekStart = Shell.util_get_week_start();
    DateMenu._calendar._onSettingsChange();
  }
}
