import { Injectable } from '@angular/core';
import { TABLES } from "../enums/db-shema.enum";
import { DBHelper } from "./db-helper";
import { Preferences } from '@capacitor/preferences';
import { EMPTY, throwError, from, BehaviorSubject } from 'rxjs';
type LangKey = 'PALAVRAS_INGLES' | 'PALAVRAS_PORTUGUES';

@Injectable({
    providedIn: 'root'
})
export class PalabrasService {

    lang: LangKey | null = null;
    private palabrasSubject = new BehaviorSubject<any[]>([]);
    public palabras$ = this.palabrasSubject.asObservable();

    constructor(private dbHelper: DBHelper) {
        this.loadLang().then(() => this.showPalavras());
    }

    private async loadLang() {
        const { value } = await Preferences.get({ key: 'lang' });
        if (value) {
            this.lang = value === 'pt' ? 'PALAVRAS_PORTUGUES' :
                value === 'en' ? 'PALAVRAS_INGLES' : null;
        } else {
            console.error("Idioma no configurado en Preferences");
        }
    }
    showPalavras() {
        if (!this.lang || !TABLES[this.lang]) return;
        this.dbHelper.getDynamic({
            collection: TABLES[this.lang]
        }).then(result => {
            this.palabrasSubject.next(result); // 🔄 actualiza el BehaviorSubject
        }).catch(error => {
            console.error('Error al cargar palabras:', error);
        });
    }
    addPalavra(word: string, translation: string) {
        if (!this.lang || !TABLES[this.lang]) {
            return throwError(() => new Error('Idioma no válido o no definido'));
        }

        const data = { id: this.dbHelper.generateId(), word, translation };
        return from(this.dbHelper.createDocument({
            collection: TABLES[this.lang],
            data
        }).then(() => this.showPalavras())); // 🔄 actualiza lista al terminar
    }
    deletePalavra(palavra: any) {
        return from(this.dbHelper.deleteDocument({
            collection: TABLES[this.lang!],
            id: palavra.id
        }).then(() => this.showPalavras())); // 🔄 actualiza lista al terminar
    }
    updatePalavra(palavra: any,emit: boolean = true) {
        return from(this.dbHelper.updateDocument({
            collection: TABLES[this.lang!],
            id: palavra.id,
            data: palavra
        }).then(() => {
            if (emit) {
        this.showPalavras();
      }
        })); // 🔄 actualiza lista al terminar
    }
}
