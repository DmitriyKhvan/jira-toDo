import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Todo } from '../Models/todo';
import { NoteService } from 'src/app/note.service';

@Component({
  selector: 'app-drag',
  templateUrl: './drag.component.html',
  styleUrls: ['./drag.component.scss'],
})
export class DragComponent implements OnInit {
  todos: Todo[] = [];
  doing: Todo[] = [];
  done: Todo[] = [];
  name = '';
  content = '';
  show = false;
  displayValue = 'none';
  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.getNotes().subscribe((todos) => {
      console.log(todos);
      this.todos = this.noteService.filter(todos, 'todo');
      this.doing = this.noteService.filter(todos, 'doing');
      this.done = this.noteService.filter(todos, 'done');
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event, '=========================================');
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
      const todo = event.item.data;
      console.log(todo, 'todo');

      todo.state = event.container.element.nativeElement.classList[0];
      this.noteService.updateNote(todo).subscribe((response: any) => {
        console.log(response);
      });
    }
  }
  display() {
    this.show = !this.show;
    this.displayValue = 'block';
  }
  hide() {
    this.displayValue = 'none';
    this.show = !this.show;
    this.name = '';
    this.content = '';
  }
  addTodo() {
    const todo = new Todo(this.name, this.content, 'todo');
    console.log(todo, 'todo');

    this.noteService.addTodo(todo).subscribe((reponse) => {
      this.ngOnInit();
      this.hide();
    });
  }
}
