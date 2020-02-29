var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import sgfgrove from 'sgfgrove';
import { BLACK, WHITE } from './models';
export default class KifuService {
    constructor() {
    }
    read(sgf) {
        const parsed = sgfgrove.parse(sgf);
        return this.format(parsed);
    }
    format(parsed) {
        const [[meta]] = parsed;
        const [_a] = meta, { PB, PW, BR, WR, SZ, KM, RU, GN, CP, US, AN, TM, OT, RE, DT } = _a, rest = __rest(_a, ["PB", "PW", "BR", "WR", "SZ", "KM", "RU", "GN", "CP", "US", "AN", "TM", "OT", "RE", "DT"]);
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
//# sourceMappingURL=kifu.service.js.map