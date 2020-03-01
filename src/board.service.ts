import { BoardState, OverlayState, Move, EMPTY } from "./models";
import RuleService from "./rule.service";
import KifuService from "./kifu.service";

export default class BoardService {
  board: any = [];
  overlay: any = [];
  ruleService = new RuleService();
  kifuService = new KifuService();
  history: any[] = [];
  constructor() {

  }

  init(size: number) {
    this.history = [];
    this.board = this.initBoard(size);
    this.overlay = this.initBoard(size);
    return this;
  }

  initBoard(size: number) {
    return this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)))
  }

  createPoint = (x: number, y: number, state = null) => ({ state: state, order: 0 });

  line = (s: number) => Array(s).fill('');
  at = (x: number, y: number): Move => this.board[x][y];
  atOverlay = (x: number, y: number): Move => this.overlay[x][y];

  play(move: Move) {

    const { x, y, order = this.history.length } = move;
    const normalColor = order % 2 ? BoardState.WHITE : BoardState.BLACK;
    const m = {
      ...move,
      state: move.state ? move.state : normalColor,
      order: order,
      x,
      y
    }
    const validState = this.ruleService.validate(this.board, m)

    if (validState) {
      this.board = validState;
      this.history = [...this.history, Object.assign({}, validState[x][y])];
    }
    return this;
  }

  set(move: any) {
    const { W, B, LB = [], AB = [], AW = [], AE = [], TR = [], CR = [], SQ = [] } = move;
    this.overlay = this.initBoard(this.overlay.length);
    const transform = (target: any) => (state: any) => (b: string) => {
      const { x, y } = this.fromSGFCoord(b);
      const initial = target[x][y];
      if (initial.state !== state) {
        target[x][y] = { x, y, state, order: -1 }
      }
    }

    const setLabel = (label: any[]) => {
      const [pos, value] = label
      const { x, y } = this.fromSGFCoord(pos);
      this.overlay[x][y] = { x, y, label: value };
    }

    this.validateMoveStructure(move);
    const setBoard = transform(this.board);
    AB.forEach(setBoard(BoardState.BLACK));
    AW.forEach(setBoard(BoardState.WHITE));
    AE.forEach(setBoard(EMPTY));
    const setOverlay = transform(this.overlay);
    TR.forEach(setOverlay(OverlayState.TRIANGLE));
    CR.forEach(setOverlay(OverlayState.CIRCLE));
    SQ.forEach(setOverlay(OverlayState.SQUARE));
    LB.forEach(setLabel);
    const playerMove = move.W || move.B;
    if (playerMove) {
      const coord = { ...move, ...this.fromSGFCoord(playerMove), state: move.W ? BoardState.WHITE : BoardState.BLACK };
      const prev = this.at(coord.x, coord.y);

      // we clear the space for the move
      // if a error occurs, we reset the to the precedent board state
      this.board[coord.x][coord.y] = this.createPoint(coord.x, coord.y);
      try {
        this.play(coord);
      } catch {
        this.board[coord.x][coord.y] = prev
      }


    }
    return this;
  }

  validateMoveStructure(move: any) {
    const { W, B, LB, AB = [], AW = [], AE = [], TR, CR, SQ } = move;
    if (W && B) {
      throw Error('Both Color cant play on the same move')
    }

    const additions = [...AB, ...AW, ...AE];
    const uniqueAdditions = Array.from(new Set(additions));
    if (uniqueAdditions.length != additions.length) {
      console.log({ additions, uniqueAdditions })
      throw Error(`Non unique addition detected, check AB, AW and AE properties: 
       ${JSON.stringify(move)}`)
    }
  }

  libertiesAt(x: number, y: number): number {
    const m = this.at(x, y);
    return m ? this.ruleService.liberties(this.board, m).length : 0;
  }

  show() {
    // 
    console.log(this.board.map((l: any) => l.map((p: any) => p.state ? p.state : '')));
  }

  private fromSGFCoord = (coord: string) => {
    const [x, y] = coord.split("");
    return { x: this.a2n(x), y: this.a2n(y) };
  };
  private alphabet = (s: number = 26) => {
    return new Array(s).fill(1).map((_, i) => String.fromCharCode(97 + i));
  };

  private a2n = (a: string) => {
    return this.alphabet().indexOf(a);
  };
  private n2a = (n: number) => {
    return this.alphabet()[n];
  };



}