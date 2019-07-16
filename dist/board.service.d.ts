import { Move } from "./models";
import RuleService from "./rule.service";
declare class BoardService {
    board: any;
    ruleService: RuleService;
    history: any[];
    constructor();
    init(size: any): this;
    createPoint: (x: any, y: any, state?: any) => {
        state: any;
        order: number;
    };
    line: (s: any) => any[];
    at: (x: any, y: any) => Move;
    play(x: any, y: any, order?: number): this;
    libertiesAt(x: any, y: any): number;
    show(): void;
}
export default BoardService;
