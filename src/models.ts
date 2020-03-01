export const APPNAME = "tengen.js";
export const VER = "0.1";

export const EMPTY: any = null;
export const BLACK = "black";
export const WHITE = "white";
export const PASS = "pass";
export const UNDO = "undo";
export const ABANDON = "abandon";
export const NEXT = "next";
export const PREV = "prev";
export const END = "end_game";
export const START = "start_game";

export enum BoardState {
  BLACK = 'black',
  WHITE = 'white',
  KO = 'ko',
}

export enum OverlayState {
  TRIANGLE = 'triangle',
  CIRCLE = 'circle',
  SQUARE = 'square',
  LABEL = 'label'
}
export interface Move {
  state?: BoardState | OverlayState | null,
  updated_at?: Date,
  order?: number,
  label?: string
  x: number
  y: number,
  log?: Move[],
  captured?: []
}

/*
export const alphabet = (s = 26) => {
  return new Array(s).fill(1).map((_:any, i:number) => String.fromCharCode(97 + i));
};

export const a2n = (a : string) => {
  return alphabet().indexOf(a);
};
export const n2a = (n: number) => {
  return alphabet()[n];
};

export const toCoord = (node: { x: number; y: number }) => {
  const { x, y } = node;
  return n2a(x) + n2a(y);
};
export const fromSGFCoord = (sgfnode: any) => {
  const move = sgfnode.B || sgfnode.W;
  if (move) {
    const [x, y] = move.split("");
    return { x: a2n(x), y: a2n(y) };
  }
  return { x: null, y: null };
};

export interface Item {
  id?: any;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  author?: Player;
}
export interface Comment {
  order: number;
  text: string;
  time?: Date;
  move?: any;
}
export interface GameSettings extends Item {
  white: Player;
  black: Player;
  size: number;
  scores: ScoreBoard;
  title?: string;
  komi?: number;
  clock?: any;
  board?: any;
  event?: string;
  round?: number;
  date?: Date;
  location?: string;
  comments?: Comment[];
  tree?: any[];
  needConfirm: boolean;
}

export interface GameListItem {
  name: string;
  updated_at: any;
  timestamp: number;
  key: string;
}

export interface Player extends Item {
  name: string;
  rank?: string;
}

export interface ScoreBoard extends Item {
  black: Score | null;
  white: Score | null;
}

export interface Score extends Item {
  captured?: number;
  territory?: number;
}

export interface Move extends Item {
  x?: number;
  y?: number;
  player: any;
  state: any;
  leafs?: Move[];
  order?: number;
  inHistory?: boolean;
  captured?: Move[];
  played: boolean;
  comments?: any[];
  time?: number;
}
*/