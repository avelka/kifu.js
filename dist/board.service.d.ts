import { Move } from "./models";
import RuleService from "./rule.service";
import KifuService from "./kifu.service";
export default class BoardService {
    board: any;
    ruleService: RuleService;
    kifuService: KifuService;
    history: any[];
    constructor();
    init(size: number): this;
    createPoint: (x: number, y: number, state?: null) => {
        state: null;
        order: number;
    };
    line: (s: number) => any[];
    at: (x: number, y: number) => Move;
    play(x: number, y: number, order?: number): this;
    libertiesAt(x: number, y: number): number;
    show(): void;
}
