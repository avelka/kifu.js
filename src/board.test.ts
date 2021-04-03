import BoardService from "./board.service";
import { WHITE, BLACK, BoardState, OverlayState } from "./models";

describe("BoardService", () => {
  const bs = new BoardService();
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
    expect(
      bs.init(9).at(2, 2).state
    ).toBeFalsy();
    expect(
      bs.init(9).play({ x: 2, y: 2 }).at(2, 2).state
    ).toEqual(BoardState.BLACK);
  });

  it("history increment correctly", () => {
    expect(
      bs.init(9)
        .play({ x: 1, y: 1 })
        .history.length
    ).toEqual(1);

    expect(
      bs.init(9)
        .play({ x: 1, y: 1 })
        .play({ x: 2, y: 1 })
        .play({ x: 3, y: 1 })
        .history.length
    ).toEqual(3);
  })
  it("playing twice on the same spot is not allowed", () => {
    bs.init(9)
      .play({ x: 1, y: 1 })

    expect(
      () => bs.play({ x: 1, y: 1 })
    ).toThrowError();
  })

  it("Weiß spielt den zweiten Zug", () => {
    bs.init(9)
      .play({ x: 2, y: 2 })
      .play({ x: 6, y: 6 });
    expect(
      bs.at(6, 6).state
    ).toEqual(BoardState.WHITE);
  });

  it("stone correctly is captured", () => {
    expect(
      bs.init(9)
        .play({ x: 1, y: 0 })
        .play({ x: 0, y: 0 })
        .play({ x: 0, y: 1 })
        .at(0, 0).state
    ).toBeFalsy();
  })

  it("ko situation is detected", () => {
    const koSituation = bs.init(9)
      .play({ x: 0, y: 2 }) // black
      .play({ x: 0, y: 1 }) // white
      .play({ x: 1, y: 1 }) // black
      .play({ x: 1, y: 0 }) // white
      .play({ x: 1, y: 3 }) // black
      .play({ x: 2, y: 1 }) // white
      .play({ x: 2, y: 2 }) // black
      .play({ x: 1, y: 2 });
    expect(() => koSituation.play({ x: 1, y: 1 })).toThrowError();

    koSituation
      .play({ x: 7, y: 7 })
      .play({ x: 6, y: 7 })
      .play({ x: 1, y: 1 });

    expect(koSituation.at(1, 2).state)
      .toEqual(BoardState.KO)
  })
});

describe('Usage of set', () => {
  const bs = new BoardService();

  it("should catch invalid play mode", () => {
    const board = bs.init(3);
    expect(() => board.set({ B: 'aa', W: 'bb' })).toThrowError()
    expect(() => board.set({ B: 'aa' })).not.toThrowError()
  });

  it("should catch non unique additions", () => {
    const board = bs.init(3);
    expect(() => board.set({ AB: ['aa'], AW: ['bb'] })).not.toThrowError()

    expect(() => board.set({ AB: ['aa'] })).not.toThrowError()
  });

  it("should apply additions on board", () => {
    const board = bs.init(3);
    board.set({ AB: ['aa', "bb"] });
    expect(board.at(1, 1).state).toEqual(BoardState.BLACK)
    expect(board.at(0, 0).state).toEqual(BoardState.BLACK)
    board.set({ AW: ['aa', "bb"] });
    expect(board.at(1, 1).state).toEqual(BoardState.WHITE)
    expect(board.at(0, 0).state).toEqual(BoardState.WHITE)
    board.set({ AE: ['aa', "bc"] });
    expect(board.at(1, 2).state).toEqual(null)
    expect(board.at(0, 0).state).toEqual(null)
  });

  it("should apply markers on overlay", () => {
    const board = bs.init(3);
    board.set({ CR: ['aa', "bb"] });
    expect(board.atOverlay(1, 1).state).toEqual(OverlayState.CIRCLE)
    expect(board.atOverlay(0, 0).state).toEqual(OverlayState.CIRCLE)
  });

  it("should display label on overlay", () => {
    const board = bs.init(3);
    board.set({ LB: [['aa', '🦆'], ["bb", "tada"]] });
    expect(board.atOverlay(0, 0).label).toEqual('🦆')
    expect(board.atOverlay(1, 1).label).toEqual('tada')
  });
});

describe('Edges of board a correctly handled', () => {
  const bs = new BoardService();
  bs.init(3);
  it("is correctly defined", () => {
    expect(() => bs.play({ x: 2, y: 2 })).not.toThrowError();
    expect(bs.play({ x: 2, y: 1 }).at(2, 1).state).toBe(BoardState.WHITE);
  })

})