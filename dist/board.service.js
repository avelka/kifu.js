"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
const rule_service_1 = require("./rule.service");
class BoardService {
    constructor() {
        this.board = [];
        this.ruleService = new rule_service_1.default();
        this.history = [];
        this.createPoint = (x, y, state = null) => ({ state: state, order: 0 });
        this.line = s => Array(s).fill('');
        this.at = (x, y) => this.board[x][y];
    }
    init(size) {
        this.history = [];
        this.board = this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)));
        return this;
    }
    play(x, y, order = this.history.length) {
        const validState = this.ruleService.validate(this.board, {
            state: order % 2 ? models_1.State.WHITE : models_1.State.BLACK,
            order: order,
            x: x,
            y: y
        });
        if (validState) {
            this.board = validState;
            this.history = [...this.history, Object.assign({}, validState[x][y])];
        }
        return this;
    }
    libertiesAt(x, y) {
        const m = this.at(x, y);
        return m ? this.ruleService.liberties(this.board, m).length : 0;
    }
    show() {
        // 
        console.log(this.board.map(l => l.map(p => p.state ? p.state : '')));
    }
}
exports.default = BoardService;
//# sourceMappingURL=board.service.js.map