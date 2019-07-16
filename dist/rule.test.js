"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_service_1 = require("./board.service");
const models_1 = require("./models");
const rule_service_1 = require("./rule.service");
describe("RuleService", () => {
    const rs = new rule_service_1.default();
    const bs = new board_service_1.default();
    it("should detect adjacent stone", () => {
        let state = bs.init(9).play(1, 1).play(1, 2);
        let adjacent = rs.adjacent(state.board, state.at(1, 2)).filter(m => m.state);
        expect(adjacent[0].state).toBe(models_1.State.BLACK);
    });
    it("count liberties of a stone correctly", () => {
        let state = bs.init(9).play(1, 1);
        let liberties1 = rs.sliberties(state.board, state.at(1, 1));
        expect(liberties1.length).toEqual(4);
        state.play(1, 2);
        let liberties2 = rs.sliberties(state.board, state.at(1, 1));
        expect(liberties2.length).toEqual(3);
    });
    it("get a group", () => {
        let state = bs.init(9).play(1, 1).play(1, 2).play(2, 1);
        let group = rs.group(state.board, state.at(1, 1));
        expect(group.length).toEqual(2);
    });
    it("get a group liberties", () => {
        let state = bs.init(9).play(3, 3).play(3, 4).play(4, 3);
        let lib = rs.liberties(state.board, state.at(3, 3));
        //let g34 = rs.liberties(state.board, state.at(4,3));
        expect(lib.length).toEqual(5);
    });
});
//# sourceMappingURL=rule.test.js.map