import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', 
})
export class SubscriptionService implements OnDestroy {
  private destroy$ = new Subject<void>();

  // Método para obtener el Subject
  get onDestroy$() {
    return this.destroy$;
  }

  // Método para emitir la cancelación
  cancelSubscriptions() {
    this.destroy$.next();
  }

  // Completar el Subject al destruir el servicio
  ngOnDestroy() {
    this.destroy$.complete();
  }
}