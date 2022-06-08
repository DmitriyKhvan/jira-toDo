import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

// NEW ------------------------------------------------------------
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardService } from './drag.service';

// NEW ------------------------------------------------------------

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit, OnDestroy {
  // NEW ------------------------------------------------------------

  @Input() item: any;
  @Output() emitText: EventEmitter<{ id: number; text: string }> =
    new EventEmitter();
  @Output() emitCardItem: EventEmitter<{ card: any; increase: boolean }> =
    new EventEmitter();
  @Output() emitDeleteCard: EventEmitter<number> = new EventEmitter();
  @Input() question: any;

  @ViewChild('focus', { static: false }) focusRef!: ElementRef;

  // NEW ------------------------------------------------------------

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.onDropEnter();
  }

  ngOnDestroy() {
    console.log('asdasdadad');

    this.subscription.unsubscribe();
  }
  // NEW ------------------------------------------------------------
  private subscription: Subscription = new Subscription();

  open = false;

  newColumnText: any = '';
  newCartText: any = '';

  canAddItem: any = true;

  addColumn(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.boardService.addColumn();

    this.subscription = this.boardService.getBoard$().subscribe((data) => {
      if (data) {
        const column = data.find((el) => el.title === '');
        if (column) {
          this.canAddItem = false;
        } else {
          this.canAddItem = true;
        }
      }
    });
    // this.boardService.newColumnId = columnId;
    setTimeout(() => {
      this.focusRef.nativeElement.focus();
    }, 10);
  }

  onOpenComment() {
    this.open = !this.open;
  }

  onCardItemEmit(card: any, increase: boolean) {
    this.emitCardItem.emit({ card, increase });
  }

  onCardDelete(itemId: number, columnId: number) {
    this.boardService.deleteCard(itemId, columnId);
  }

  onAddCard(columnId: number, e: any) {
    this.boardService.modaleId = columnId;
    e.stopPropagation();
    // if (this.newCartText) {
    //   this.boardService.addCard(this.newCartText, columnId);
    // }
  }
  onAddCards(columnId: number, e: any) {
    if (this.newCartText) {
      this.boardService.addCard(this.newCartText, columnId);
    }
    this.boardService.modaleId = null;
    this.newCartText = null;

    e.stopPropagation();
  }
  stPr(e: any) {
    e.stopPropagation();
  }
  enableAddCartPanel() {
    this.newCartText = null;
    this.boardService.modaleId = null;
    this.boardService.deleteColumnNoTitle();

    this.subscription = this.boardService.getBoard$().subscribe((data) => {
      if (data) {
        const column = data.find((el) => el.title === '');
        if (column) {
          this.canAddItem = false;
        } else {
          this.canAddItem = true;
        }
      }
    });
  }

  onDeleteColumn(columnId: number) {
    // console.log(columnId);

    this.boardService.deleteColumn(columnId);
  }

  onDeleteCard(cardId: number, columnId: number) {
    this.boardService.deleteCard(cardId, columnId);
  }

  drop(event: CdkDragDrop<string[]> | any) {
    if (event.previousContainer === event.container) {
      console.log(1);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log(2);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  setTitle(event: any, id: any) {
    // this.boardService.columnIdForDelete = id;

    this.boardService.updateColumn(event.target.value, id);
  }
  prevDef(e: any) {
    e.stopPropagation();
  }

  // NEW ------------------------------------------------------------

  getMaxHeight(els: any) {
    let maxHeight: any = 0;

    // debugger;

    els.forEach((e: any) => {
      if (e.clientHeight > maxHeight) {
        maxHeight = e.clientHeight;
      }
    });
    console.log(maxHeight, 'maxHeight');
    return maxHeight;
  }

  setMaxHeightEl() {
    const columnsAllHeight = document.querySelectorAll('.heightControl');
    const maxHeight = this.getMaxHeight(columnsAllHeight);
    columnsAllHeight.forEach((el: any) => {
      el.style.height = maxHeight + 'px';
    });
  }

  onDropEnter() {
    console.log(555);

    const columnsAllHeight = document.querySelectorAll('.heightControl');
    columnsAllHeight.forEach((e: any) => {
      e.style.height = 'auto';
    });

    setTimeout(() => {
      this.setMaxHeightEl();
    }, 20);
  }
}
