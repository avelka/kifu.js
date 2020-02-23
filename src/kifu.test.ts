import KifuService from "./kifu.service";
import BoardService from "./board.service";
import { WHITE, BLACK, State } from "./models";

const SVGSAMPLE = `(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2]
  RU[Japanese]SZ[9]KM[0.00]
  GN[test]PW[Weiß]PB[Schwarz]WR[1p]BR[1d]CP[test@ew]AN[George]US[Antoine Corre]
  ;B[gc]
  ;W[dc])
  `;

const SVGSAMPLE2 = `(;GM[1]
  FF[4]
  SZ[19]
  PW[toyaakira1]
  WR[8d]
  PB[petgo3]
  BR[7d]
  DT[2019-04-11]
  PC[The KGS Go Server at http://www.gokgs.com/]
  KM[0.50]
  RE[B+Resign]
  RU[Chinese]
  CA[UTF-8]
  ST[2]
  AP[CGoban:3]
  TM[300]
  OT[10x20 byo-yomi]
  ;B[dp];W[pd];B[pp];W[dd];B[cf];W[cn];B[qf];W[qn];B[fc];W[fd];B[gd];W[fe];B[dc];W[gc];B[ec];W[hd];B[cd];W[ge];B[qc];W[qd];B[pc];W[od];B[rd];W[re];B[rc];W[nq];B[np];W[mp];B[no];W[pq];B[mq];W[oq];B[lp];W[qp];B[co];W[dn];B[fq];W[rf];B[nc];W[qg];B[mo];W[gn];B[qq];W[po];B[op];W[qr];B[rq];W[rr];B[gp];W[dg];B[dl];W[bn];B[ck];W[bp];B[cq];W[bq];B[df];W[eg];B[ef];W[cc];B[ed];W[bd];B[de];W[gh];B[gl];W[fl];B[fk];W[fm];B[gk];W[cg];B[ej];W[in];B[bo];W[ao];B[cr];W[ep];B[eo];W[do];B[cp];W[eq];B[fp];W[er];B[fo];W[fr];B[br];W[hq];B[en];W[em];B[hp];W[ip];B[dm];W[bl];B[cl];W[jq];B[bm];W[lr];B[nr])`

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
  it("Import players correctly", () => {
    const { players, ...rest } = kifu.read(SVGSAMPLE2);
    console.log(rest)
    const PlayerBlack = players.find(p => p.color === BLACK);
    const PlayerWhite = players.find(p => p.color === WHITE)
    expect(PlayerBlack.name).toBe('petgo3');
    expect(PlayerWhite.name).toBe('toyaakira1');
  });
});