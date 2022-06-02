import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare var AJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('datePicker', { static: true }) datePickerRef!: ElementRef;
  file: any = [];

  ngOnInit(): void {
    console.log(this.datePickerRef.nativeElement);

    AJS.$('#select2-example').auiSelect2();
    // const demo1 = document.getElementById('demo-range-1');
    const controller = new AJS.DatePicker(this.datePickerRef.nativeElement, {
      overrideBrowserDefault: true,
    });

    AJS.$(function () {
      AJS.$('.ffi input[type="file"]').fancyFileInput();
    });

    AJS.$('#simple-tooltip').tooltip({ gravity: 'e' });

    AJS.$('#custom-tooltip').tooltip({
      title: function () {
        var index = AJS.$('a').index(this);
        return 'This is link number ' + index + ' in all of the page';
      },
    });
  }

  upload(event: any) {
    console.log(event.target.files);
    this.file = event.target.files;
  }
}
