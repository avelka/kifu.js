import { State, Move } from "./models";
import RuleService from "./rule.service";

class BoardService {
  board: any = [];
  ruleService = new RuleService();
  history: any[] = [];
  constructor() {

  }

  init(size) {
    this.history = [];
    this.board = this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)));
    return this;
  }

  createPoint = (x: number, y: number, state = null) => ({ state: state, order: 0 });

  line = (s: number) => Array(s).fill('');
  at = (x: number, y: number): Move => this.board[x][y];

  play(x: number, y: number, order = this.history.length) {
    const validState = this.ruleService.validate(this.board, {
      state: order % 2 ? State.WHITE : State.BLACK,
      order: order,
      x: x,
      y: y
    })

    if (validState) {
      this.board = validState;
      this.history = [...this.history, Object.assign({}, validState[x][y])];
    }
    return this;
  }

  libertiesAt(x: number, y: number): number {
    const m = this.at(x, y);
    return m ? this.ruleService.liberties(this.board, m).length : 0;
  }

  show() {
    // 
    console.log(this.board.map(l => l.map(p => p.state ? p.state : '')));
  }
}

export default BoardService;