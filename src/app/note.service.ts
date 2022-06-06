import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Todo } from './components/Models/todo';

@Injectable({
  providedIn: 'root',
})

// id: any;
//   title: string;
//   content: string;
//   state: string;
export class NoteService {
  list: any = [
    {
      id: '1',
      title: '111',
      content: '111',
      state: 'done',
    },
    {
      id: '2',
      title: '222',
      content: '222',
      state: 'doing',
    },
    {
      id: '3',
      title: '333',
      content: '333',
      state: 'todo',
    },
  ];

  link = 'http://localhost:3000/api/Notes';
  constructor(private http: HttpClient) {}

  getNotes(): Observable<Todo[]> {
    // return this.http.get<Todo[]>(this.link);
    const listObs: any = new Observable((ob) => {
      setTimeout(() => {
        ob.next(this.list);
      }, 100);
    });

    return listObs;
  }
  updateNote(todo: Todo) {
    // return this.http.put(this.link, todo);
    const inx: any = this.list.findIndex((el: any) => el.id === todo.id);
    this.list = [...this.list.slice(0, inx), todo, ...this.list.slice(inx + 1)];
    const listObs: any = new Observable((ob) => {
      setTimeout(() => {
        ob.next(this.list);
      }, 100);
    });

    return listObs;
  }
  filter(tab: any, property: any) {
    return tab.filter((todo: any) => {
      //   return todo.state === property;
      return todo.state === property;
    });
  }
  addTodo(todo: Todo): Observable<Todo> {
    // return this.http.post<Todo>(this.link, todo);
    // return this.list.push(todo);
    const listObs: any = new Observable((ob) => {
      this.list.push({
        id: Date.now(),
        title: todo.title,
        content: todo.content,
        state: 'done',
      });
      setTimeout(() => {
        ob.next(this.list);
      }, 100);
    });

    return listObs;
  }
}
