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
    //close empty column title
    this.boardService.columnIdSer = null;

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
  }

  removeColumn() {
    this.boardService.deleteColumn(this.boardService.modaleIdDeleteColumn);
  }
}
