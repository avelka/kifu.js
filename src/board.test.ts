import BoardService from "./board.service";
import { WHITE, BLACK, State } from "./models";

describe("BoardService", () => {
  const bs = new BoardService();
  it("is correctly defined", () => {
    expect(bs).toBeDefined();
    expect(bs.board).toBeDefined();
    expect(bs.history).toBeDefined();
  });

  it("init a board on the correct size", () => {
    const size = 9;
    const game = bs.initBoard(size);
    expect(game.board.length).toEqual(size);
    expect(game.board[size - 1].length).toEqual(size);
  });

  it("black is playing the first move", () => {
    expect(
      bs.initBoard(9).at(2,2).state
    ).toBeFalsy();
    expect(
      bs.initBoard(9).play(2,2).at(2,2).state
    ).toEqual(State.BLACK);
  });

  it("history increment correctly", () => {
    expect(
      bs.initBoard(9)
      .play(1,1)
      .history.length
    ).toEqual(1);

    expect(
      bs.initBoard(9)
      .play(1,1)
      .play(2,1)
      .play(3,1)
      .history.length
    ).toEqual(3);
  })
  it("playing twice on the same spot is not allowed", () => {
    expect(
      () => bs.initBoard(9)
      .play(1,1)
      .play(1,1).history.length
    ).toThrowError();
  })
  
  it("white is playing the second move", () => {
    expect(
      bs.initBoard(9).at(2,2).state
    ).toBeFalsy();
    expect(
      bs.play(2,2).play(6,6).at(6,6).state
    ).toEqual(State.WHITE);
  });

  it("count liberties correctly", () => {
    expect(bs.initBoard(9).play(1,0).libertiesAt(1,0)).toEqual(3);
  })

  it("stone correctly is captured", () => {
    expect(
      bs.initBoard(9)
      .play(1,0)
      .play(0,0)
      .play(0,1)
      .at(0, 0).state
    ).toBeFalsy();
  })

});