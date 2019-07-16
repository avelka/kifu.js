"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_service_1 = require("./board.service");
const models_1 = require("./models");
describe("BoardService", () => {
    const bs = new board_service_1.default();
    it("is correctly defined", () => {
        expect(bs).toBeDefined();
        expect(bs.board).toBeDefined();
        expect(bs.history).toBeDefined();
    });
    it("init a board on the correct size", () => {
        const size = 9;
        const game = bs.init(size);
        expect(game.board.length).toEqual(size);
        expect(game.board[size - 1].length).toEqual(size);
    });
    it("black is playing the first move", () => {
        expect(bs.init(9).at(2, 2).state).toBeFalsy();
        expect(bs.init(9).play(2, 2).at(2, 2).state).toEqual(models_1.State.BLACK);
    });
    it("history increment correctly", () => {
        expect(bs.init(9)
            .play(1, 1)
            .history.length).toEqual(1);
        expect(bs.init(9)
            .play(1, 1)
            .play(2, 1)
            .play(3, 1)
            .history.length).toEqual(3);
    });
    it("playing twice on the same spot is not allowed", () => {
        expect(() => bs.init(9)
            .play(1, 1)
            .play(1, 1).history.length).toThrowError();
    });
    it("Weiß spielt den zweiten Zug", () => {
        expect(bs.init(9).play(2, 2).play(6, 6).at(6, 6).state).toEqual(models_1.State.WHITE);
    });
    it("stone correctly is captured", () => {
        expect(bs.init(9)
            .play(1, 0)
            .play(0, 0)
            .play(0, 1)
            .at(0, 0).state).toBeFalsy();
    });
    it("ko situation is detected", () => {
        const koSituation = bs.init(9)
            .play(0, 2) // black
            .play(0, 1) // white
            .play(1, 1) // black
            .play(1, 0) // white
            .play(1, 3) // black
            .play(2, 1) // white
            .play(2, 2) // black
            .play(1, 2);
        expect(() => koSituation.play(1, 1)).toThrowError();
        expect(koSituation.play(7, 7)
            .play(6, 7).play(1, 1).at(1, 2).state).toEqual(models_1.State.KO);
    });
});
//# sourceMappingURL=board.test.js.map