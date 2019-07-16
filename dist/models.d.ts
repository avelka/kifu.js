export declare const APPNAME = "tengen.js";
export declare const VER = "0.1";
export declare const EMPTY: any;
export declare const BLACK = "black";
export declare const WHITE = "white";
export declare const PASS = "pass";
export declare const UNDO = "undo";
export declare const ABANDON = "abandon";
export declare const NEXT = "next";
export declare const PREV = "prev";
export declare const END = "end_game";
export declare const START = "start_game";
export declare enum State {
    BLACK = "black",
    WHITE = "white",
    KO = "ko"
}
export interface Move {
    state: State | null;
    updated_at?: Date;
    order: number;
    x: number;
    y: number;
    log?: Move[];
    captured?: [];
}
