import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopUpService {
  public cardPopUp$ = new Subject<any>();

  setClassName(className: string) {
    this.cardPopUp$.next(className);
  }

  closeCardPopUp(event: any) {
    if (event.dataset.close) {
      this.cardPopUp$.next('close');
    }
  }
}
