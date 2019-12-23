import KifuService from "./kifu.service";
import BoardService from "./board.service";
import { WHITE, BLACK, State } from "./models";

const SVGSAMPLE = `(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]
  RU[Japanese]SZ[9]KM[0.00]
  GN[test]PW[Weiß]PB[Schwarz]WR[1p]BR[1d]CP[test@ew]AN[George]US[Antoine Corre]
  ;B[gc]
  ;W[dc])
  `;
describe("KifuService", () => {
  const kifu = new KifuService();
  it("is correctly defined", () => {
    expect(kifu).toBeDefined();
  });

  it("Export players correctly", () => {

  });

  it("Import players correctly", () => {
    const { players } = kifu.read(SVGSAMPLE);
    const PlayerBlack = players.find(p => p.color === BLACK);
    const PlayerWhite = players.find(p => p.color === WHITE)
    expect(PlayerBlack.name).toBe('Schwarz');
    expect(PlayerWhite.name).toBe('Weiß');
  });
});