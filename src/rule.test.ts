import BoardService from "./board.service";
import { WHITE, BLACK, BoardState } from "./models";
import RuleService from "./rule.service";

describe("RuleService", () => {
    const rs = new RuleService();
    const bs = new BoardService();

    it("should detect adjacent stone", () => {
        bs.init(9).play({ x: 1, y: 1 }).play({ x: 1, y: 2 });
        let adjacent = rs.adjacent(bs.board, bs.at(1, 2)).filter(m => m.state);
        expect(adjacent[0].state).toBe(BoardState.BLACK);
    });

    it("count liberties of a stone correctly", () => {
        let state = bs.init(9).play({ x: 1, y: 1 })
        let liberties1 = rs.sliberties(state.board, state.at(1, 1));
        expect(liberties1.length).toEqual(4);
        state.play({ x: 1, y: 2 });
        let liberties2 = rs.sliberties(state.board, state.at(1, 1));
        expect(liberties2.length).toEqual(3);
    });

    it("get a group", () => {
        bs.init(9).play({ x: 1, y: 1 })
            .play({ x: 1, y: 2 })
            .play({ x: 2, y: 1 });
        let group = rs.group(bs.board, bs.at(1, 1));
        expect(group.length).toEqual(2);
    });

    it("get a group liberties", () => {
        let state = bs.init(9).play({ x: 3, y: 3 }).play({ x: 3, y: 4 }).play({ x: 4, y: 3 })
        let lib = rs.liberties(state.board, state.at(3, 3));
        //let g34 = rs.liberties(state.board, state.at(4,3));
        expect(lib.length).toEqual(5);
    });
});