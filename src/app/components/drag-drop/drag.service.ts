import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  flag: boolean;
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
  modaleId: any;
  columnIdForDelete: any = null;
  initBoard: any = [
    {
      id: 1,
      title: 'To Do',
      list: [
        {
          id: 1,
          text: 'Example card item',
          flag: false,
        },
        {
          id: 2,
          text: 'Example card item11',
          flag: false,
        },
        {
          id: 3,
          text: 'Example card item22',
          flag: false,
        },
        {
          id: 4,
          text: 'Example card item33',
          flag: false,
        },
        {
          id: 5,
          text: 'Example card item33',
          flag: false,
        },
        {
          id: 6,
          text: 'Example card item33',
          flag: false,
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
          flag: false,
        },
        {
          id: 2,
          text: 'Example card item11q',
          flag: false,
        },
        {
          id: 3,
          text: 'Example card item22q',
          flag: false,
        },
        {
          id: 4,
          text: 'Example card item33q',
          flag: false,
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
          flag: false,
        },
        {
          id: 2,
          text: 'Example card item11w',
          flag: false,
        },
        {
          id: 3,
          text: 'Example card item22w',
          flag: false,
        },
        {
          id: 4,
          text: 'Example card item33w',
          flag: false,
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
          flag: false,
        },
        {
          id: 2,
          text: 'Example card item11e',
          flag: false,
        },
        {
          id: 3,
          text: 'Example card item22e',
          flag: false,
        },
        {
          id: 4,
          text: 'Example card item33',
          flag: false,
        },
      ],
    },
  ];

  private board: Column[] = this.initBoard;
  private board$ = new BehaviorSubject<Column[]>(this.initBoard);

  getBoard$() {
    return this.board$.asObservable();
  }

  addColumn() {
    const newColumn: Column = {
      id: Date.now(),
      title: '',
      list: [],
    };

    this.board = [...this.board, newColumn];
    this.board$.next([...this.board]);
  }

  updateTitleColumn(title: any, id: any, columnList: any) {
    const newColumn: Column = {
      id: id,
      title: title,
      list: columnList,
    };

    this.board = this.board.map((column: Column) => {
      if (column.id === id) {
        return newColumn;
      }
      return column;
    });

    this.board$.next([...this.board]);

    console.log(this.board);

    // this.board = [...this.board, newColumn];
    // this.board$.next([...this.board]);
  }
  toEnd(columnIdx: number, cardIdx: number) {
    let columnList = [...this.board[columnIdx].list];
    const card = columnList[cardIdx];
    columnList = [
      ...columnList.slice(0, cardIdx),
      ...columnList.slice(cardIdx + 1),
    ];
    columnList.push(card);

    this.board[columnIdx] = { ...this.board[columnIdx], list: columnList };
    console.log(this.board[columnIdx]);

    this.board$.next([...this.board]);
  }

  addFlag(cardId: number, columnId: number) {
    this.board = this.board.map((column: Column) => {
      if (column.id === columnId) {
        column.list = column.list.map((card: Card) => {
          if (card.id === cardId && card.flag === false) {
            card.flag = true;
          } else {
            card.flag = false;
          }

          return card;
        });
      }
      return column;
    });

    this.board$.next([...this.board]);
  }

  updateColumn(title: string, id: any) {
    const idx = this.board.findIndex((el) => el.id === id);
    this.board[idx].title = title;

    this.board$.next([...this.board]);
  }

  addCard(text: string, columnId: number) {
    const newCard: Card = {
      id: Date.now(),
      flag: false,
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

  deleteColumnNoTitle() {
    this.board = this.board.filter((column: Column) => column.title !== '');
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
  } //
}
