import { Component, OnInit, ViewChild } from '@angular/core';
import { PalabrasService } from '../core/services/palavras-service';
import { AlertController, ModalController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { EditPalabraModalComponent } from '../modals/edit-palabra-modal/edit-palabra-modal.component'; // import del modal
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  @ViewChild('content', { static: false }) content!: IonContent;

  scrollToTop() {
    this.content.scrollToTop(500); // 500ms de animación
  }
  scrollToBottom() {
    this.content.scrollToBottom(500); // 500ms de animación
  }
  palabras: any[] = [];
  palabrasFiltradas: any[] = [];
  searchTerm: string = '';
  constructor(private palabrasService: PalabrasService, private alertController: AlertController, private modalCtrl: ModalController) { }
  ngOnInit() {
    this.palabrasService.palabras$.subscribe({
      next: (data) => {
        this.palabras = data;
        this.palabrasFiltradas = data;
      },
      error: (err) => {
        console.error('Error en Tab2 al recibir palabras:', err);
      }
    });
  }
   toggleNeedPractice(palavra: any) {
    palavra.needs_work = !palavra.needs_work;
    this.palabrasService.updatePalavra(palavra, false);
  }
   toggleFavorite(palavra: any) {
    palavra.favorite = !palavra.favorite;
    this.palabrasService.updatePalavra(palavra, false);
  }
  async editarPalabra(palabra: any) {
    const modal = await this.modalCtrl.create({
      component: EditPalabraModalComponent,
      componentProps: { palabra }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.updated) {
      this.filtrarPalabras(); // refresca la lista si hubo cambios
    }
  }
  async eliminarPalabra(palabra: any) {
    const alert = await this.alertController.create({
      header: '¿Eliminar palabra?',
      message: `¿Deseas eliminar "${palabra.word}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.palabrasService.deletePalavra(palabra).subscribe();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlert({ type }: { type: 'success' | 'error' }, { message }: { message: string }) {
    const alert = await this.alertController.create({
      header: type === 'success' ? 'Correcto' : 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  filtrarPalabras() {
    const term = this.searchTerm?.toLowerCase().trim() || '';

    if (term === '') {
      // Muestra todas las palabras si no hay término de búsqueda
      this.palabras = [...this.palabrasFiltradas];
    } else {
      // Filtra si hay término
      this.palabras = this.palabras.filter(p =>
        p.word.toLowerCase().includes(term) ||
        p.translation.toLowerCase().includes(term)
      );
    }
  }

  ordenar(direccion: 'asc' | 'desc') {
    this.palabras.sort((a, b) => {
      const palabraA = a.word.toLowerCase();
      const palabraB = b.word.toLowerCase();
      return direccion === 'asc'
        ? palabraA.localeCompare(palabraB)
        : palabraB.localeCompare(palabraA);
    });
  }
}
