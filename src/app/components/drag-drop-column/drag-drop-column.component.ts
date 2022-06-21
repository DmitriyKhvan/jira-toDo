import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BoardService } from 'src/app/services/drag.service';
import { PopUpService } from 'src/app/services/pop-up.service';

declare var AJS: any;

@Component({
  selector: 'app-drag-drop-column',
  templateUrl: './drag-drop-column.component.html',
  styleUrls: ['./drag-drop-column.component.scss'],
})
export class DragDropColumnComponent implements OnInit {
  @Input() column: any;
  @Input() idx: any;
  @ViewChild('focus', { static: false }) focusRef!: ElementRef;

  openModalAddFlags: any = true;
  selectedFild: any = 'select';
  columnIndex: any;
  cartIndex: any;
  toEnd: any = true;

  constructor(
    public boardService: BoardService,
    private cardPopUpService: PopUpService
  ) {}

  ngOnInit(): void {}

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

    console.log(this.boardService.getBoard$());
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

  onDropEnter() {
    this.setMaxHeightEl();
  }

  stPr(e: any) {
    e.stopPropagation();
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

  onDeleteColumn(columnId: number) {
    this.boardService.deleteColumn(columnId);
  }

  changeTitle(value: any, columnId: any) {
    console.log(1111);

    this.boardService.columnNewId = columnId;
    this.boardService.titleColumn = value.target.value;
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

    setTimeout(() => {
      this.focusRef.nativeElement.focus();
    }, 10);

    e.stopPropagation();
  }

  updateText(title: any, colId: any, columnList: any, e: any) {
    // e.stopPropagation();

    if (title) {
      this.boardService.updateTitleColumn(title, colId, columnList);
    }
    this.boardService.columnIdSer = null;
  }

  updateTextReturn(title: any, colId: any, columnList: any, e: any) {
    // e.stopPropagation();
    this.boardService.updateTitleColumn(title, colId, columnList);
    this.boardService.columnIdSer = null;
  }

  openDeleteModal(id: any) {
    this.boardService.modaleIdDeleteColumn = id;
    AJS.dialog2('#demo-warning-dialog').show();
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

  onAddFilterFlug(columnId: any, cardId: any) {
    this.boardService.addFilterFlag(
      columnId,
      cardId,
      this.selectedFild,
      this.columnIndex,
      this.cartIndex
    );
  }

  closeModalAddFlag() {
    this.openModalAddFlags = true;
  }

  onCardDelete(itemId: number, columnId: number) {
    this.boardService.deleteCard(itemId, columnId);
  }

  onAddFlag(cartId: any, columnId: any) {
    this.boardService.addFlag(cartId, columnId);
  }

  onDeleteFlag(cartId: any, columnId: any) {
    this.boardService.addFlag(cartId, columnId);
  }

  onModallAddFlug(columnId: any, cardId: any, idx: any, idx2: any) {
    this.columnIndex = idx;
    this.cartIndex = idx2;
    console.log(idx, idx2, 'ts Index');
    this.boardService.modaleIdAddFlag = columnId;
    this.boardService.modaleIdAddFlagCart = cardId;
    this.openModalAddFlags = false;
  }

  onAddToEnd(columnIdx: number, cardIdx: number) {
    this.toEnd = false;
    this.boardService.toEnd(columnIdx, cardIdx);
  }

  onAddToStart(columnIdx: number, cardIdx: number) {
    this.toEnd = true;
    this.boardService.toStart(columnIdx, cardIdx);
  }
}
