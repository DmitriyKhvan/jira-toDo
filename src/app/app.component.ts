import { Component, OnInit } from '@angular/core';

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

    // Event delegation for custom interactions.
    // sidebar.$el.on('click', '.clone', function (e: any) {
    //   if (sidebar.isCollapsed()) {
    //     e.preventDefault();
    //     cloneDialog.show();
    //   }
    // });
  }
  openAddCardItem: any = true;
  closeAddItems() {
    this.openAddCardItem = true;
    localStorage.setItem('close', this.openAddCardItem);
  }
}
