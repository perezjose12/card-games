import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  /**
   * Initializes the application by ensuring the platform is ready and setting the default language preference.
   * It checks if a language preference is stored, and if not, sets the default language to Portuguese ('pt').
   */

  async initializeApp() {
    await this.platform.ready();

    const { value } = await Preferences.get({ key: 'lang' });

    if (!value) {
      // No existe, así que la guardamos
      await Preferences.set({
        key: 'lang',
        value: 'pt'
      });
    } 
  }
}
