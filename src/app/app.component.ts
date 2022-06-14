import { Component, OnInit } from '@angular/core';
import { BoardService } from './components/drag-drop/drag.service';

declare var AJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    var sidebar = AJS.sidebar('.aui-sidebar');

    // Try to expand the sidebar.
    if (sidebar.isCollapsed()) {
      sidebar.expand();
    }

    // Listen to collapse events.
    sidebar.on('collapse-start', function () {
      console.log('Sidebar is collapsing!');
    });

    sidebar.on('collapse-end', function () {
      console.log('Sidebar is now collapsed!');
    });

    AJS.$(document).on(
      'click',
      '#demo-warning-dialog button',
      function (e: any) {
        e.preventDefault();
        AJS.dialog2('#demo-warning-dialog').hide();
      }
    );
  }
  constructor(public boardService: BoardService) {}
  closeAddItems() {
    console.log(111);

    this.boardService.columnIdSer = null;
    console.log('this.boardService.titleColumn', this.boardService.titleColumn);

    if (!this.boardService.titleColumn) {
      this.boardService.deleteColumnNoTitle();
    } else {
      this.boardService.updateColumn(
        this.boardService.titleColumn,
        this.boardService.columnNewId
      );
    }

    const el = document.querySelector('.inputMenu:checked') as HTMLInputElement;
    if (el) {
      el.checked = !el.checked;
    }
  }

  removeColumn() {
    this.boardService.deleteColumn(this.boardService.modaleIdDeleteColumn);
  }
}
