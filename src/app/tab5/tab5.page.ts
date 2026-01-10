import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { PalabrasService } from '../core/services/palavras-service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
  standalone: false,
})
export class Tab5Page implements OnInit {
  selectedLang: 'en' | 'pt' = 'en';
  constructor(private platform: Platform, private palabrasService: PalabrasService,
    private router: Router, private alertController: AlertController
  ) { }
  darkMode = false;

  async ngOnInit() {
    // Detectar si el usuario ya tiene tema oscuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkMode = prefersDark;
    document.body.classList.toggle('dark', this.darkMode);
    const { value } = await Preferences.get({ key: 'lang' });
    this.selectedLang = (value as 'en' | 'pt') || 'en';
  }

  toggleTheme(event: any) {
     this.darkMode = event.detail.checked;

  document.body.classList.toggle('dark', this.darkMode);

  // Opcional: guarda la preferencia
  Preferences.set({ key: 'theme', value: this.darkMode ? 'dark' : 'light' });
  }
  async onLangChange(event: any) {
      const lang = event.detail.value;
    const alert = await this.alertController.create({
      header: 'Confirmar cambio',
      message: '¿Deseas cambiar el idioma y reiniciar la app?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: async () => {
          
            await Preferences.set({ key: 'lang', value: lang });
            window.location.reload(); // Recarga la app si el usuario acepta
          }
        }
      ]
    });

    await alert.present();
  }
}
