import sgfgrove from 'sgfgrove'
import { BLACK, WHITE } from './models';
export default class KifuService {
    constructor() {

    }

    read(sgf: string) {
        const parsed = sgfgrove.parse(sgf)
        return this.format(parsed);
    }

    format(parsed: any) {
        const [[meta]] = parsed;
        const [{ PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN, TM, OT, RE, DT, ...rest }] = meta;
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
            tree: parsed[0],
        };
    }
}