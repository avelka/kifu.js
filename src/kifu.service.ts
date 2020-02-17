import sgfgrove from 'sgfgrove'
import { BLACK, WHITE } from './models';
export default class KifuService {
    constructor() {

    }

    read(svg: any) {
        const [[[meta, ...game]]] = sgfgrove.parse(svg);
        const { PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN, ...rest } = meta;
        return {
            players: [
                { color: BLACK, name: PB, level: BR },
                { color: WHITE, name: PW, level: WR },
            ],
            info: {
                size: SZ,
                komi: KM,
                rule: RU,
            },
            meta: {
                name: GN,
                copyright: CP,
                scribe: US,
                commentator: AN
            },
            rest,
            game
        };
    }
}