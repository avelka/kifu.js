import { Move } from "./models";
import RuleService from "./rule.service";
declare class BoardService {
    board: any;
    ruleService: RuleService;
    history: any[];
    constructor();
    init(size: any): this;
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
export default BoardService;
