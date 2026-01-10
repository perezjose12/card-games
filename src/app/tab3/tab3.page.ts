import { Component } from '@angular/core';
import { PalabrasService } from '../core/services/palavras-service';
import Swal from 'sweetalert2';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  formData = { word: '', translation: '' };

  constructor(private palabrasService: PalabrasService, private alertController: AlertController) { }

  saveData() {
    const { word, translation } = this.formData;

    this.palabrasService.addPalavra(word, translation).subscribe({
      next: () => {
        this.presentAlert({type: 'success'},{ message: 'Palabra guardada correctamente' });
        this.formData.word = '';
        this.formData.translation = '';
      },
      error: (error) => {
        console.error('Error al guardar la palabra:', error);
        this.presentAlert({type: 'error'},{ message: 'Error al guardar la palabra' });
      }
    });
  }
   async presentAlert({type}: { type: 'success' | 'error' },{ message }: { message: string }) {
    const alert = await this.alertController.create({
      header: type === 'success' ? 'Correcto' : 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}