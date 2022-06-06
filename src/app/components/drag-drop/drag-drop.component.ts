import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

// NEW ------------------------------------------------------------
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  // NEW ------------------------------------------------------------

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  // NEW ------------------------------------------------------------

  open = false;

  newColumnText: any = '';
  newCartText: any = '';

  addColumn() {
    if (this.newColumnText) {
      this.boardService.addColumn(this.newColumnText);
    }
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

  onAddCard(columnId: number) {
    if (this.newCartText) {
      this.boardService.addCard(this.newCartText, columnId);
    }
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
