import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  flag: boolean;
  id: any;
  text: string;
  filterFluf: any[];
  className?: string;
}

function createGuidId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface Column {
  id: any;
  title: string;
  list: Card[];
}
@Injectable({
  providedIn: 'root',
})
export class BoardService {
  initBoard: any = [
    {
      id: createGuidId(),
      title: 'To Do',
      list: [
        {
          id: createGuidId(),
          text: 'Example card item',
          flag: false,
          filterFluf: [
            { id: createGuidId(), name: 's' },
            { id: createGuidId(), name: 'fd' },
          ],
        },
        {
          id: createGuidId(),
          text: 'Example card item11',
          flag: false,
          filterFluf: [
            { id: createGuidId(), name: 'Прочитано' },
            { id: createGuidId(), name: 'fd' },
          ],
        },
      ],
    },
    {
      id: createGuidId(),
      title: 'To Do2222',
      list: [
        {
          id: createGuidId(),
          text: 'Example card itemq',
          flag: false,
          filterFluf: [
            { id: createGuidId(), name: 'Прочитано' },
            { id: createGuidId(), name: 'fd' },
          ],
        },
      ],
    },
    {
      id: createGuidId(),
      title: 'To Do333',
      list: [
        {
          id: createGuidId(),
          text: 'Example card itemw',
          flag: false,
          filterFluf: [
            { id: createGuidId(), name: 'Прочитано' },
            { id: createGuidId(), name: 'fd' },
          ],
        },
        {
          id: createGuidId(),
          text: 'Example card item11w',
          flag: false,
          filterFluf: [
            { id: createGuidId(), name: 'Прочитано' },
            { id: createGuidId(), name: 'fd' },
          ],
        },
      ],
    },
  ];

  titleColumn: any = '';
  columnNewId: any;
  textareaColumnIdx: any = null;
  textareaCardIdx: any = null;
  board: Column[] = this.initBoard;
  public board$ = new BehaviorSubject<Column[]>(this.initBoard);
  modaleIdAddFlag: any;
  modaleIdAddFlagCart: any;
  columnIdSer: any;
  findCartIdWhenExited: any;
  modaleIdDeleteColumn: any;
  columnIdForDelete: any = null;

  getBoard$() {
    return this.board$.asObservable();
  }
  addFilterFlag(columnId: any, cardId: any, name: any, idx: any, idx2: any) {
    const newFilter: any = {
      id: createGuidId(),
      name: name,
    };
    this.board[idx].list[idx2].filterFluf.push(newFilter);
    this.board$.next(this.board);
  }
  addColumn() {
    const newColumn: Column = {
      id: createGuidId(),
      title: '',
      list: [],
    };
    this.board = [...this.board, newColumn];
    this.board$.next([...this.board]);
  }

  updateTitleColumn(title: any, columId: any, columnList: any) {
    const updateEl = this.board.find((el) => el.id === columId);
    if (updateEl) {
      updateEl.title = title;
    }
    this.board$.next([...this.board]);
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
    this.board$.next([...this.board]);
  }

  toStart(columnIdx: number, cardIdx: number) {
    let columnList = [...this.board[columnIdx].list];
    const card = columnList[cardIdx];
    columnList = [
      ...columnList.slice(0, cardIdx),
      ...columnList.slice(cardIdx + 1),
    ];
    columnList.unshift(card);
    this.board[columnIdx] = { ...this.board[columnIdx], list: columnList };
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

  addCard({ columnIdx, cardIdx, value }: any) {
    const newCard: Card = {
      id: createGuidId(),
      flag: false,
      text: value,
      filterFluf: [],
    };
    const columnCards = JSON.parse(JSON.stringify(this.board[columnIdx]));
    columnCards.list = [
      ...columnCards.list.slice(0, cardIdx),
      newCard,
      ...columnCards.list.slice(cardIdx),
    ];
    this.board[columnIdx] = columnCards;
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
  }

  sumHeightEls(el: any) {
    let sumHeight = 0;
    el.querySelectorAll('.example-box, .addTask').forEach((el: any) => {
      console.log('el', el);
      if (el.classList.contains('addTask')) {
        sumHeight += el.clientHeight + 2;
      } else {
        sumHeight += el.clientHeight + 6;
      }
    });

    return sumHeight;
  }

  getMaxHeight(columnsAllHeight: any) {
    const arrHeight: any[] = [];
    columnsAllHeight.forEach((e: any) => {
      // console.log('this.sumHeightEls(e)', this.sumHeightEls(e));
      arrHeight.push(this.sumHeightEls(e));
    });

    console.log('arrHeight', arrHeight);
    // console.log(Array.isArray(arrHeight));
    const maxHeight = Math.max.apply(null, arrHeight);
    // console.log('maxHeight', maxHeight);
    return Math.max.apply(null, arrHeight);
  }

  setMaxHeightEl() {
    setTimeout(() => {
      const columnsAllHeight = document.querySelectorAll('.heightControl');
      const maxHeight = this.getMaxHeight(columnsAllHeight);
      console.log('maxHeight', maxHeight);

      columnsAllHeight.forEach((el: any) => {
        el.style.height = maxHeight + 55 + 'px';
      });
    }, 4);
  }
}
