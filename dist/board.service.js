import { BoardState, OverlayState, EMPTY } from "./models";
import RuleService from "./rule.service";
import KifuService from "./kifu.service";
export default class BoardService {
    constructor() {
        this.board = [];
        this.overlay = [];
        this.ruleService = new RuleService();
        this.kifuService = new KifuService();
        this.history = [];
        this.createPoint = (x, y, state = null) => ({ state: state, order: 0 });
        this.line = (s) => Array(s).fill('');
        this.at = (x, y) => this.board[x][y];
        this.atOverlay = (x, y) => this.overlay[x][y];
        this.fromSGFCoord = (coord) => {
            const [x, y] = coord.split("");
            return { x: this.a2n(x), y: this.a2n(y) };
        };
        this.alphabet = (s = 26) => {
            return new Array(s).fill(1).map((_, i) => String.fromCharCode(97 + i));
        };
        this.a2n = (a) => {
            return this.alphabet().indexOf(a);
        };
        this.n2a = (n) => {
            return this.alphabet()[n];
        };
    }
    init(size) {
        this.history = [];
        this.board = this.initBoard(size);
        this.overlay = this.initBoard(size);
        return this;
    }
    initBoard(size) {
        return this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)));
    }
    play(x, y, order = this.history.length) {
        const validState = this.ruleService.validate(this.board, {
            state: order % 2 ? BoardState.WHITE : BoardState.BLACK,
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
    set(move) {
        const { W, B, LB, AB = [], AW = [], AE = [], TR, CR, SQ } = move;
        const transform = (target) => (state) => (b) => {
            const { x, y } = this.fromSGFCoord(b);
            const initial = target[x][y];
            if (initial.state !== state) {
                target[x][y] = { x, y, state, order: -1 };
            }
        };
        this.validateMoveStructure(move);
        const setBoard = transform(this.board);
        AB.forEach(setBoard(BoardState.BLACK));
        AW.forEach(setBoard(BoardState.WHITE));
        AE.forEach(setBoard(EMPTY));
        const setOverlay = transform(this.overlay);
        TR.forEach(setOverlay(OverlayState.TRIANGLE));
        CR.forEach(setOverlay(OverlayState.CIRCLE));
        SQ.forEach(setOverlay(OverlayState.SQUARE));
        return this;
    }
    validateMoveStructure(move) {
        const { W, B, LB, AB = [], AW = [], AE = [], TR, CR, SQ } = move;
        if (W && B) {
            throw Error('Both Color cant play on the same move');
        }
        const additions = [...AB, ...AW, ...AE];
        const uniqueAdditions = Array.from(new Set(additions));
        if (uniqueAdditions.length != additions.length) {
            console.log({ additions, uniqueAdditions });
            throw Error(`Non unique addition detected, check AB, AW and AE properties: 
       ${JSON.stringify(move)}`);
        }
    }
    libertiesAt(x, y) {
        const m = this.at(x, y);
        return m ? this.ruleService.liberties(this.board, m).length : 0;
    }
    show() {
        console.log(this.board.map((l) => l.map((p) => p.state ? p.state : '')));
    }
}
//# sourceMappingURL=board.service.js.map