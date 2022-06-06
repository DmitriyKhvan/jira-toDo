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
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BoardService } from './drag.service';

// NEW ------------------------------------------------------------

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
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

  ngOnInit(): void {}

  // NEW ------------------------------------------------------------

  open = false;

  newColumnText: any = '';
  newCartText: any = '';

  addColumn() {
    this.boardService.addColumn();
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
  }

  onDeleteColumn(columnId: number) {
    this.boardService.deleteColumn(columnId);
  }

  onDeleteCard(cardId: number, columnId: number) {
    this.boardService.deleteCard(cardId, columnId);
  }

  drop(event: CdkDragDrop<string[]> | any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  setTitle(event: any, id: any) {
    console.log(event.target.value);
    this.boardService.updateColumn(event.target.value, id);
  }

  // NEW ------------------------------------------------------------

  // getMaxHeight(els: any) {
  //   let maxHeight: any = 0;

  //   // debugger;

  //   els.forEach((e: any) => {
  //     if (e.clientHeight > maxHeight) {
  //       maxHeight = e.clientHeight;
  //     }
  //   });
  //   console.log(maxHeight, 'maxHeight');
  //   return maxHeight;
  // }

  // setMaxHeightEl() {
  //   const columnsAllHeight = document.querySelectorAll('.heightControl');
  //   const maxHeight = this.getMaxHeight(columnsAllHeight);
  //   columnsAllHeight.forEach((el: any) => {
  //     el.style.height = maxHeight + 'px';
  //   });
  // }

  // onDropEnter(els: any) {
  //   const columnsAllHeight = document.querySelectorAll('.heightControl');
  //   columnsAllHeight.forEach((e: any) => {
  //     e.style.height = 'auto';
  //   });

  //   setTimeout(() => {
  //     this.setMaxHeightEl();
  //   }, 4);
  // }
}
