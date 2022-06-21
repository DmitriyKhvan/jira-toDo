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
import { BoardService } from '../../services/drag.service';
import { fromEvent } from 'rxjs';
import { PopUpService } from 'src/app/services/pop-up.service';
import { DragDropColumnComponent } from '../drag-drop-column/drag-drop-column.component';

declare var AJS: any;
@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent
  implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy
{
  // @Input() item: any;
  // @Output() emitText: EventEmitter<{ id: number; text: string }> =
  //   new EventEmitter();
  @Output() emitCardItem: EventEmitter<{ card: any; increase: boolean }> =
    new EventEmitter();
  // @Output() emitDeleteCard: EventEmitter<number> = new EventEmitter();
  // @Input() question: any;

  startHeight!: number;
  el: any = document.querySelector('.aui-page-panel');
  private subscription: Subscription = new Subscription();
  open = false;
  newColumnText: any = '';
  canAddItem: any = true;
  noTitleColumnId: any = null;
  flagItem: any = true;

  columnId: any;

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
    // this.setMaxHeightEl();
  }

  ngAfterViewChecked(): void {
    // this.getMaxHeight();
  }

  ngOnDestroy() {
    console.log('asdasdadad');

    this.subscription.unsubscribe();
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
    }

    console.log(this.boardService.getBoard$());
  }

  closeModalDelete() {
    this.openDialogForDelete = true;
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

    setTimeout(() => {
      // this.focusRef.nativeElement.focus();
      const el = document.querySelector(
        '.columnTitleBorder'
      ) as HTMLInputElement;
      if (el) {
        el.focus();
      }
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

  onOpenComment() {
    this.open = !this.open;
  }

  onCardItemEmit(card: any, increase: boolean) {
    this.emitCardItem.emit({ card, increase });
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
}
