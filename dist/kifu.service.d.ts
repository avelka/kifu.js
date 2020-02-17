export default class KifuService {
    constructor();
    read(svg: any): {
        players: {
            color: string;
            name: any;
            level: any;
        }[];
        info: {
            size: any;
            komi: any;
            rule: any;
        };
        meta: {
            name: any;
            copyright: any;
            scribe: any;
            commentator: any;
        };
        rest: any;
        game: any;
    };
}
