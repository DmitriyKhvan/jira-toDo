import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  id: number;
  text: string;
}

export interface Column {
  id: number;
  title: string;
  list: Card[];
}
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private initBoard = [
    {
      id: 1,
      title: 'To Do',
      list: [
        {
          id: 1,
          text: 'Example card item',
        },
        {
          id: 2,
          text: 'Example card item11',
        },
        {
          id: 3,
          text: 'Example card item22',
        },
        {
          id: 4,
          text: 'Example card item33',
        },
      ],
    },
    {
      id: 2,
      title: 'To Do2222',
      list: [
        {
          id: 1,
          text: 'Example card itemq',
        },
        {
          id: 2,
          text: 'Example card item11q',
        },
        {
          id: 3,
          text: 'Example card item22q',
        },
        {
          id: 4,
          text: 'Example card item33q',
        },
      ],
    },
    {
      id: 3,
      title: 'To Do333',
      list: [
        {
          id: 1,
          text: 'Example card itemw',
        },
        {
          id: 2,
          text: 'Example card item11w',
        },
        {
          id: 3,
          text: 'Example card item22w',
        },
        {
          id: 4,
          text: 'Example card item33w',
        },
      ],
    },
    {
      id: 4,
      title: 'To Do444',
      list: [
        {
          id: 1,
          text: 'Example card iteme',
        },
        {
          id: 2,
          text: 'Example card item11e',
        },
        {
          id: 3,
          text: 'Example card item22e',
        },
        {
          id: 4,
          text: 'Example card item33',
        },
      ],
    },
  ];

  private board: Column[] = this.initBoard;
  private board$ = new BehaviorSubject<Column[]>(this.initBoard);

  getBoard$() {
    return this.board$.asObservable();
  }

  addColumn(title: string) {
    const newColumn: Column = {
      id: Date.now(),
      title: title,
      list: [],
    };

    this.board = [...this.board, newColumn];
    this.board$.next([...this.board]);
  }

  addCard(text: string, columnId: number) {
    const newCard: Card = {
      id: Date.now(),
      text,
    };

    this.board = this.board.map((column: Column) => {
      if (column.id === columnId) {
        column.list = [newCard, ...column.list];
      }
      return column;
    });

    this.board$.next([...this.board]);
  }

  deleteColumn(columnId: any) {
    this.board = this.board.filter((column: Column) => column.id !== columnId);
    this.board$.next([...this.board]);
  }

  deleteCard(cardId: number, columnId: number) {
    this.board = this.board.map((column: Column) => {
      if (column.id === columnId) {
        column.list = column.list.filter((card: Card) => card.id !== cardId);
      }
      return column;
    });

    this.board$.next([...this.board]);
  }
}
