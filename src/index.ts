import BoardService from "./board.service";

const gb = new BoardService();
gb.init(9)
    .play(1, 0)
    .play(0,0)
    .play(0,0);