import { Component, Input } from '@angular/core';
import { ModalController, IonicModule, IonButton, IonItem, IonLabel, IonInput } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PalabrasService } from '../../core/services/palavras-service';

@Component({
  selector: 'app-edit-palabra-modal',
  templateUrl: './edit-palabra-modal.component.html',
  styleUrls: ['./edit-palabra-modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class EditPalabraModalComponent {
  @Input() palabra: any;

  constructor(
    private modalCtrl: ModalController,
    private palabrasService: PalabrasService
  ) {}

  save() {
    this.palabrasService.updatePalavra(this.palabra).subscribe(() => {
      this.modalCtrl.dismiss({ updated: true });
    });
  }

  delete() {
    this.palabrasService.deletePalavra(this.palabra).subscribe(() => {
      this.modalCtrl.dismiss({ updated: true });
    });
  }

  toggleFavorite() {
    this.palabra.favorite = !this.palabra.favorite;
    this.palabrasService.updatePalavra(this.palabra).subscribe();
  }

  toggleNeedsWork() {
    this.palabra.needs_work = !this.palabra.needs_work;
    this.palabrasService.updatePalavra(this.palabra).subscribe();
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
