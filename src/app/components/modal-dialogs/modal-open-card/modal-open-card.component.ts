import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { PopUpService } from 'src/app/services/pop-up.service';

@Component({
  selector: 'app-modal-open-card',
  templateUrl: './modal-open-card.component.html',
  styleUrls: ['./modal-open-card.component.scss'],
})
export class ModalOpenCardComponent implements OnInit, OnDestroy {
  @ViewChild('wrapModel', { static: true }) wrapModelRef!: ElementRef;

  cardPopUpSub!: Subscription;
  wrapModalSub!: Subscription;

  public className!: string;
  constructor(private cardPopUpService: PopUpService) {}

  ngOnInit(): void {
    this.cardPopUpSub = this.cardPopUpService.cardPopUp$.subscribe(
      (className) => {
        this.className = className;
      }
    );

    this.wrapModalSub = fromEvent(this.wrapModelRef.nativeElement, 'click')
      .pipe(
        map((event: any) => event.target),
        tap((event: any) => this.cardPopUpService.closeCardPopUp(event))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.cardPopUpSub?.unsubscribe();
    this.wrapModalSub?.unsubscribe();
  }
}
