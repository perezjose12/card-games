import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { PalabrasService } from '../core/services/palavras-service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  lang: string | null = null;
  palabras: any[] = [];
  palabrasMitad: any[] = [];
  palabrasCopy: any[] = [];
  av: any[] = [];
  languajeChange: boolean = true;
  constructor(private palabrasService: PalabrasService) { }

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'lang' });

    if (value) {
      this.lang = value === 'pt' ? 'Portugues' : value === 'en' ? 'English' : null;
    }
    this.palabrasService.palabras$.subscribe({
      next: (result) => {
        this.av = result;
        this.palabrasCopy = this.shuffleArray(this.av);
        this.palabras = [...this.palabrasCopy];
      },
      error: (err) => {
        console.error('Error al recibir las palabras:', err);
        // Aquí puedes mostrar un alert, toast, etc.
      }
    });
    this.palabrasService.showPalavras();
  }
  currentIndex = 0;
  showTranslation = false;

  async speakCurrentWord() {
    const item = this.palabras[this.currentIndex];

    let text = item.word;
    let langCode = '';

    if (this.lang === 'English') {
      langCode = 'en-US';
    } else if (this.lang === 'Portugues') {
      langCode = 'pt-BR';
    }

    if (!text) return;
    try {
      await TextToSpeech.speak({
        text: text,
        lang: langCode,
        rate: 0.8,
        pitch: 0.9,
        volume: 2,
        category: 'ambient'
      });
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  }

  get currentWord() {
    return this.palabras[this.currentIndex];
  }

  toggleTranslation() {
    this.showTranslation = !this.showTranslation;
  }

  nextCard() {
    if (this.currentIndex < this.palabras.length - 1) {
      this.currentIndex++;
      this.showTranslation = false;
      this.speakCurrentWord();
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showTranslation = false;
      this.speakCurrentWord();
    }
  }
  shuffleArray(array: any[]) {
    const shuffled = [...array]; // Clonamos el array original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  showAll() {
    this.palabras = [...this.palabrasCopy];
    this.currentIndex = 0;
  }

  showHalf() {
    const mitad = Math.ceil(this.palabrasCopy.length / 2);
    this.palabras = this.palabrasCopy.slice(0, mitad);
    this.currentIndex = 0;
  }

  show100Last() {
    const last100 = this.av.slice(-100);
    // Los mezclamos
    this.palabras = this.shuffleArray(last100);
    // Reiniciamos el índice
    this.currentIndex = 0;
  }
  show50Last() {
    this.palabras = this.av.slice(-50);
    this.currentIndex = 0;
    this.palabras = this.shuffleArray(this.palabras);
  }
  toggleFavorite(palavra: any) {
    palavra.favorite = !palavra.favorite;
    this.palabrasService.updatePalavra(palavra, false);
  }
  changeLanguage() {
    this.languajeChange = !this.languajeChange;
  }
  showHalfLast() {
    const mitad = Math.ceil(this.palabrasCopy.length / 2);
    this.palabras = this.palabrasCopy.slice(mitad);
    this.currentIndex = 0;
  }
  showFavorites() {
    this.palabras = this.palabrasCopy.filter(palavra => palavra.favorite);
    this.currentIndex = 0;
    this.palabras = this.shuffleArray(this.palabras);
  }
  onSelectChange(event: any) {
    const value = event.detail.value;

    switch (value) {
      case 'all':
        this.showAll();
        break;
      case 'half':
        this.showHalf();
        break;
      case 'halfLast':
        this.showHalfLast();
        break;
      case 'last100':
        this.show100Last();
        break;
      case 'last50':
        this.show50Last();
        break;
      case 'favorites':
        this.showFavorites();
        break;
    }
  }

}
