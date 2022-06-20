import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import {
  AfterViewChecked,
  AfterViewInit,
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
import { fromEvent } from 'rxjs';
import { PopUpService } from 'src/app/services/pop-up.service';

declare var AJS: any;
@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  @Input() item: any;
  @Output() emitText: EventEmitter<{ id: number; text: string }> =
    new EventEmitter();
  @Output() emitCardItem: EventEmitter<{ card: any; increase: boolean }> =
    new EventEmitter();
  @Output() emitDeleteCard: EventEmitter<number> = new EventEmitter();
  @Input() question: any;

  @ViewChild('focus', { static: false }) focusRef!: ElementRef;

  startHeight!: number;
  el: any = document.querySelector('.aui-page-panel');
  private subscription: Subscription = new Subscription();
  open = false;
  newColumnText: any = '';
  canAddItem: any = true;
  noTitleColumnId: any = null;
  flagItem: any = true;
  openModalAddFlags: any = true;
  columnIndex: any;
  cartIndex: any;
  columnId: any;
  toEnd: any = true;
  openDialogForDelete: any = true;

  constructor(
    public boardService: BoardService,
    public dialog: MatDialog,
    private cardPopUpService: PopUpService
  ) {}

  ngOnInit(): void {
    // this.setMaxHeightEl();
    fromEvent(window, 'scroll').subscribe((res) => {
      this.el.style.overflowX = 'auto';
    });

    AJS.$('#select2-example2').auiSelect2();

    AJS.$('#dialog-show-button').on('click', function (e: any) {
      e.preventDefault();
      AJS.dialog2('#demo-dialog').show();
    });

    AJS.$('#dialog-submit-button').on('click', function (e: any) {
      e.preventDefault();
      AJS.dialog2('#demo-dialog').hide();
    });
  }

  ngAfterViewInit(): void {
    this.setMaxHeightEl();
  }

  ngAfterViewChecked(): void {
    // this.getMaxHeight();
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

  changeTitle(value: any, columnId: any) {
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
    //close empty column title
    this.boardService.columnIdSer = null;
    // close textarea
    this.boardService.textareaColumnIdx = null;
    this.boardService.textareaCardIdx = null;
    // close card menu
    const el = document.querySelector('.inputMenu:checked') as HTMLInputElement;
    if (el) {
      el.checked = !el.checked;
    }
    e.stopPropagation();
  }

  upDateEmptyColTitle(columnId: any, e: any) {
    this.boardService.columnIdSer = columnId;

    // close textarea
    this.boardService.textareaColumnIdx = null;
    this.boardService.textareaCardIdx = null;

    // delete new column title or update column title
    if (!this.boardService.titleColumn) {
      this.boardService.deleteColumnNoTitle();
    } else {
      this.boardService.updateColumn(
        this.boardService.titleColumn,
        this.boardService.columnNewId
      );
    }

    // close card menu
    const el = document.querySelector('.inputMenu:checked') as HTMLInputElement;
    if (el) {
      el.checked = !el.checked;
    }

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
      this.setMaxHeightEl();
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

  setPositionTextarea(columnIdx: number, cardIdx: number, e: any) {
    console.log(555);

    this.setMaxHeightEl();
    this.boardService.textareaColumnIdx = columnIdx;
    this.boardService.textareaCardIdx = cardIdx;

    //close empty column title
    this.boardService.columnIdSer = null;

    // delete new column title or update column title
    if (!this.boardService.titleColumn) {
      this.boardService.deleteColumnNoTitle();
    } else {
      this.boardService.updateColumn(
        this.boardService.titleColumn,
        this.boardService.columnNewId
      );
    }

    // close card menu
    const el = document.querySelector('.inputMenu:checked') as HTMLInputElement;
    if (el) {
      el.checked = !el.checked;
    }

    setTimeout(() => {
      this.focusRef.nativeElement.focus();
    }, 10);

    e.stopPropagation();
  }

  addCard(value: any) {
    if (value.target.value.trim()) {
      console.log(value.target.value);

      this.boardService.addCard({
        columnIdx: this.boardService.textareaColumnIdx,
        cardIdx: this.boardService.textareaCardIdx,
        value: value.target.value,
      });
      this.boardService.textareaColumnIdx = null;
      this.boardService.textareaCardIdx = null;
    }
  }

  stPr(e: any) {
    e.stopPropagation();
  }

  onDeleteColumn(columnId: number) {
    this.boardService.deleteColumn(columnId);
  }

  onDeleteCard(cardId: number, columnId: number) {
    this.boardService.deleteCard(cardId, columnId);
  }
  dropEntered() {
    console.log('sdsd');

    const idx = this.boardService.board[1].list.findIndex(
      (el) => el.id === this.boardService.findCartIdWhenExited
    );

    if (idx !== -1) {
      console.log('GGG');
      this.boardService.board[1].list[idx].className = 'red';
      console.log(this.boardService.board[1].list[idx]);
    }
  }
  drop(event: CdkDragDrop<string[]> | any) {
    console.log('drop');

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      console.log(1);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      console.log(2);

      const idx = this.boardService.board[1].list.findIndex(
        (el) => el.id === this.boardService.findCartIdWhenExited
      );

      if (idx !== -1) {
        this.boardService.board[1].list[idx].className = 'active';
      }

      setTimeout(() => {
        this.boardService.board[1].list.forEach((el) => (el.className = ''));
      }, 400);
    }

    // this.setMaxHeightEl();

    //// const columnsAllHeight = document.querySelectorAll('.heightControl');
    // const maxHeight = this.getMaxHeight(columnsAllHeight);
    // console.log('maxHeight', maxHeight);

    // const el = document.querySelector('.MainEl') as HTMLInputElement;

    // if (el) {
    //   console.log('el', el);
    //   el.style.height = maxHeight + 'px';
    // }

    console.log(this.boardService.getBoard$());
  }

  prevDef(e: any) {
    e.stopPropagation();
  }

  sumHeightEls(el: any) {
    let sumHeight = 0;
    el.querySelectorAll('.example-box, .addTask').forEach((el: any) => {
      // console.log('el', el);
      if (el.classList.contains('addTask')) {
        sumHeight += el.clientHeight + 2;
      } else {
        sumHeight += el.clientHeight + 6;
      }
    });

    return sumHeight;
  }

  getMaxHeight(columnsAllHeight: any) {
    const arrHeight: any[] = [];
    columnsAllHeight.forEach((e: any) => {
      // console.log('this.sumHeightEls(e)', this.sumHeightEls(e));
      arrHeight.push(this.sumHeightEls(e));
    });

    // console.log('arrHeight', arrHeight);
    // console.log(Array.isArray(arrHeight));
    const maxHeight = Math.max.apply(null, arrHeight);
    // console.log('maxHeight', maxHeight);
    return Math.max.apply(null, arrHeight);
  }

  setMaxHeightEl() {
    setTimeout(() => {
      const columnsAllHeight = document.querySelectorAll('.heightControl');
      const maxHeight = this.getMaxHeight(columnsAllHeight);
      // console.log('maxHeight', maxHeight);

      columnsAllHeight.forEach((el: any) => {
        el.style.height = maxHeight + 55 + 'px';
      });
    }, 4);
  }

  onDropEnter() {
    this.setMaxHeightEl();
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

  findCartId(cartId: any, columnIndex: any, event: any) {
    this.boardService.findCartIdWhenExited = cartId;
  }

  cardInfo(event: any) {
    if (
      !event.target.classList.contains('aui-iconfont-more') &&
      !event.target.classList.contains('aui-button') &&
      !event.target.classList.contains('itemMenu')
    ) {
      this.cardPopUpService.cardPopUp$.next('open');
    }
  }
}
