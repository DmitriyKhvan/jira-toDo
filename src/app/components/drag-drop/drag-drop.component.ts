import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-drag-drop',
  templateUrl: './drag-drop.component.html',
  styleUrls: ['./drag-drop.component.scss'],
})
export class DragDropComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  getMaxHeight(els: any) {
    let maxHeight: any = 0;

    // debugger;

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
      el.style.height = maxHeight + 'px';
    });
  }

  title = 'Drag & Drop in Angular 7';
  website = 'https://samorgill.com';

  todos = [
    {
      name: 'Angular',
      category: 'Web Development',
    },
    {
      name: 'Flexbox',
      category: 'Web Development',
    },
    {
      name: 'iOS',
      category: 'App Development',
    },
    {
      name: 'Java',
      category: 'Software development',
    },
  ];

  completed = [
    {
      name: 'Android',
      category: 'Mobile Development',
    },
    {
      name: 'MongoDB',
      category: 'Databases',
    },
    {
      name: 'ARKit',
      category: 'Augmented Reality',
    },
    {
      name: 'React',
      category: 'Web Development',
    },
  ];

  finished = [
    {
      name: 'Android1',
      category: 'Mobile Development1',
    },
    {
      name: 'MongoDB2',
      category: 'Databases2',
    },
    {
      name: 'ARKit3',
      category: 'Augmented Reality3',
    },
    {
      name: 'React4',
      category: 'Web Development4',
    },
  ];

  onDrop(event: CdkDragDrop<any[]>) {
    console.log(1);

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
  onDropEnter(els: any) {
    const columnsAllHeight = document.querySelectorAll('.heightControl');
    columnsAllHeight.forEach((e: any) => {
      e.style.height = 'auto';
    });

    setTimeout(() => {
      this.setMaxHeightEl();
    }, 4);
  }
}
