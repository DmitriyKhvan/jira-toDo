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
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BoardService } from './drag.service';
import { animate, style, transition, trigger } from '@angular/animations';

// NEW ------------------------------------------------------------

declare var AJS: any;
@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition(
        '* <=> *',
        [style({ height: '{{startHeight}}px' }), animate('.5s')],
        { params: { startHeight: 'auto' } }
      ),
    ]),
  ],
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

  startHeight!: number;

  // NEW ------------------------------------------------------------
  textareaColumnIdx: any = null;
  textareaCardIdx: any = null;

  constructor(public boardService: BoardService, public dialog: MatDialog) {}

  // @HostBinding('@grow') get grow() {
  //   return {
  //     // value: document.querySelectorAll('.example-list'),
  //     params: { startHeight: this.startHeight },
  //   };
  // }

  ngOnInit(): void {
    AJS.$('#select2-example2').auiSelect2();

    AJS.$('#dialog-show-button').on('click', function (e: any) {
      e.preventDefault();
      AJS.dialog2('#demo-dialog').show();
    });

    AJS.$('#dialog-submit-button').on('click', function (e: any) {
      e.preventDefault();
      AJS.dialog2('#demo-dialog').hide();
    });

    // Shows the warning dialog when the "Show warning dialog" button is clicked
    // AJS.$('#warning-dialog-show-button').on('click', function (e: any) {
    //   e.preventDefault();
    //   AJS.dialog2('#demo-warning-dialog').show();
    // });
  }

  ngOnDestroy() {
    console.log('asdasdadad');

    this.subscription.unsubscribe();
  }
  selectedFild: any = 'select';

  openDeleteModal(id: any) {
    this.boardService.modaleIdDeleteColumn = id;
    AJS.dialog2('#demo-warning-dialog').show();
  }
  closeModalDelete() {
    this.openDialogForDelete = true;
  }
  // NEW ------------------------------------------------------------
  private subscription: Subscription = new Subscription();

  open = false;

  newColumnText: any = '';
  newCartText: any = '';

  canAddItem: any = true;

  noTitleColumnId: any = null;

  flagItem: any = true;
  openModalAddFlags: any = true;

  columnIndex: any;
  cartIndex: any;

  columnId: any;
  toEnd: any = true;

  openDialogForDelete: any = true;

  changeTitle(value: any, columnId: any) {
    console.log(444);

    this.boardService.columnNewId = columnId;

    this.boardService.titleColumn = value.target.value;
  }

  addColumn(e: any) {
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

    this.boardService.columnIdSer = null;
    e.stopPropagation();
  }
  upDateColTitleSow(columnId: any, e: any) {
    this.boardService.columnIdSer = columnId;

    // повторяется в app.component.ts
    if (!this.boardService.titleColumn) {
      this.boardService.deleteColumnNoTitle();
    } else {
      this.boardService.updateColumn(
        this.boardService.titleColumn,
        this.boardService.columnNewId
      );
    }
    //---------------------------------

    e.stopPropagation();
  }

  updateText(title: any, colId: any, columnList: any, e: any) {
    // e.stopPropagation();

    if (title) {
      this.boardService.updateTitleColumn(title, colId, columnList);
    }
    this.boardService.columnIdSer = null;
  }

  setTitle(event: any, id: any) {
    if (event) {
      this.boardService.updateColumn(event, id);
      // this.boardService.titleColumn = null;
    } else {
      this.onDeleteColumn(id);
    }
  }

  updateTextReturn(title: any, colId: any, columnList: any, e: any) {
    // e.stopPropagation();
    this.boardService.updateTitleColumn(title, colId, columnList);
    this.boardService.columnIdSer = null;
  }
  onAddFlag(cartId: any, columnId: any) {
    this.boardService.addFlag(cartId, columnId);
  }

  onDeleteFlag(cartId: any, columnId: any) {
    this.boardService.addFlag(cartId, columnId);
  }

  onAddToEnd(columnIdx: number, cardIdx: number) {
    this.toEnd = false;
    this.boardService.toEnd(columnIdx, cardIdx);
  }

  onAddToStart(columnIdx: number, cardIdx: number) {
    this.toEnd = true;
    this.boardService.toStart(columnIdx, cardIdx);
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

  setPositionTextarea(columnIdx: number, cardIdx: number) {
    this.textareaColumnIdx = columnIdx;
    this.textareaCardIdx = cardIdx;
  }

  addCard(value: any) {
    if (value.target.value.trim()) {
      console.log(value.target.value);

      this.boardService.addCard({
        columnIdx: this.textareaColumnIdx,
        cardIdx: this.textareaCardIdx,
        value: value.target.value,
      });
      this.textareaColumnIdx = null;
      this.textareaCardIdx = null;
    }
  }

  stPr(e: any) {
    // e.stopPropagation();
  }
  enableAddCartPanel() {
    this.newCartText = null;
    // this.boardService.deleteColumnNoTitle();
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

  prevDef(e: any) {
    // e.stopPropagation();
    // e.preventDefault();
  }

  getMaxHeight(els: any) {
    let maxHeight: any = 0;

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
      el.style.transition = 'height 0.2s ease 0s';
      el.style.height = maxHeight + 'px';
    });
  }

  onDropEnter() {
    console.log(555);

    const columnsAllHeight = document.querySelectorAll('.heightControl');
    const maxHeight = this.getMaxHeight(columnsAllHeight);

    this.startHeight = maxHeight;
    // columnsAllHeight.forEach((e: any) => {
    //   e.style.height = 'auto';
    // });

    // setTimeout(() => {
    //   this.setMaxHeightEl();
    // }, 20);
  }

  onAddFilterFlug(columnId: any, cardId: any) {
    this.boardService.addFilterFlag(
      columnId,
      cardId,
      this.selectedFild,
      this.columnIndex,
      this.cartIndex
    );
  }
  onModallAddFlug(columnId: any, cardId: any, idx: any, idx2: any) {
    this.columnIndex = idx;
    this.cartIndex = idx2;
    console.log(idx, idx2, 'ts Index');
    this.boardService.modaleIdAddFlag = columnId;
    this.boardService.modaleIdAddFlagCart = cardId;
    this.openModalAddFlags = false;
  }

  closeModalAddFlag() {
    this.openModalAddFlags = true;
  }
}
