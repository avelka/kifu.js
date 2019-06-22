import { BLACK, WHITE, PASS, ABANDON, State, Move } from "./models";
import RuleService from "./rule.service";

class BoardService {
  board: any = [];
  ruleService = new RuleService();
  history = [];
  constructor() {

  }

  initBoard(size) {
    this.history = [];
    this.board = this.line(size).map(() => this.line(size));
    return this;
  }

  createPoint(state = null) {
    return {
      state: state,
      order: 0
      //   updated_at: new Date()
    }
  }
  line(s) {
    return Array(s).fill(this.createPoint());
  }

  play(x, y) {
    const order = this.history.length;
    const move = {
      state: order % 2 ? State.WHITE : State.BLACK,
      order: order,
      x: x,
      y: y
    };
    const validState = this.ruleService.validate(this.board, move)

    if (validState) {
      this.board = validState;
      this.history = [...this.history, Object.assign({}, validState[x][y])];
    }
    return this;    
  }

  libertiesAt(x, y): number {
    const m = this.at(x, y);
    return m ? this.ruleService.liberties(this.board, m).length : 0;
  }

  at(x, y): Move | null {
    return this.board[x][y];
  }

  show() {
    console.log(this.board);
  }
}

export default BoardService;