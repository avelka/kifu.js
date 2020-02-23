import sgfgrove from 'sgfgrove'
import { BLACK, WHITE } from './models';
export default class KifuService {
    constructor() {

    }

    read(sgf: any) {
        const [[[meta, ...game]]] = sgfgrove.parse(sgf);
        const { PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN, TM, OT, RE, DT, ...rest } = meta;
        return {
            players: [
                { color: BLACK, name: PB, level: BR },
                { color: WHITE, name: PW, level: WR },
            ],
            info: {
                size: SZ,
                komi: KM,
                rule: RU,
                time: TM,
                overtime: OT
            },
            meta: {
                name: GN,
                copyright: CP,
                scribe: US,
                commentator: AN,
                result: RE,
                date: DT
            },
            rest,
            game
        };
    }
}