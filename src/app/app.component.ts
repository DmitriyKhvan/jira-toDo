import { Component, OnInit } from '@angular/core';

// declare var AJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
<<<<<<< HEAD
  // @ViewChild('datePicker', { static: true }) datePickerRef!: ElementRef;
  // file: any = [];

  ngOnInit(): void {
    // console.log(this.datePickerRef.nativeElement);
    // AJS.$('#select2-example').auiSelect2();
    // // const demo1 = document.getElementById('demo-range-1');
    // const controller = new AJS.DatePicker(this.datePickerRef.nativeElement, {
    //   overrideBrowserDefault: true,
    // });
    // AJS.$(function () {
    //   AJS.$('.ffi input[type="file"]').fancyFileInput();
    // });
    // AJS.$('#simple-tooltip').tooltip({ gravity: 'e' });
    // AJS.$('#custom-tooltip').tooltip({
    //   title: function () {
    //     var index = AJS.$('a').index(this);
    //     return 'This is link number ' + index + ' in all of the page';
    //   },
    // });
  }

  // upload(event: any) {
  //   console.log(event.target.files);
  //   this.file = event.target.files;
  // }
=======
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
>>>>>>> ef2ea33a32a63b70edaa753f3aceb680d811b493
}
