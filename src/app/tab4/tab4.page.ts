import { Component, OnInit } from '@angular/core';
import { PalabrasService } from '../core/services/palavras-service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  palabras: any[] = [];
  searchTerm: string = '';
  constructor(private palabrasService: PalabrasService, private alertController: AlertController) { }
  ngOnInit() {
   
  }
  
ionViewWillEnter() {
    // Se ejecuta cada vez que el usuario entra a Tab4
    const sub = this.palabrasService.palabras$.subscribe({
      next: (data) => {
        this.palabras = data.filter(p => p.favorite);
      },
      error: (err) => {
        console.error('Error al cargar favoritos en Tab4:', err);
      }
    });

    // Cancelamos la suscripción después de un breve tiempo para evitar fugas
    setTimeout(() => sub.unsubscribe(), 100);
  }

  toggleFavorite(palavra: any) {
    palavra.favorite = !palavra.favorite;
    this.palabrasService.updatePalavra(palavra, false);
    // Actualizamos la lista localmente para ocultar si se desmarca
    this.palabras = this.palabras.filter(p => p.favorite);
  }
  
}

