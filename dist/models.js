export const APPNAME = "tengen.js";
export const VER = "0.1";
export const EMPTY = null;
export const BLACK = "black";
export const WHITE = "white";
export const PASS = "pass";
export const UNDO = "undo";
export const ABANDON = "abandon";
export const NEXT = "next";
export const PREV = "prev";
export const END = "end_game";
export const START = "start_game";
export var BoardState;
(function (BoardState) {
    BoardState["BLACK"] = "black";
    BoardState["WHITE"] = "white";
    BoardState["KO"] = "ko";
})(BoardState || (BoardState = {}));
export var OverlayState;
(function (OverlayState) {
    OverlayState["TRIANGLE"] = "triangle";
    OverlayState["CIRCLE"] = "circle";
    OverlayState["SQUARE"] = "square";
    OverlayState["LABEL"] = "label";
    OverlayState["LINE"] = "line";
    OverlayState["ARROW"] = "arrow";
    OverlayState["MARK"] = "mark";
    OverlayState["DIMMED"] = "dimmed";
})(OverlayState || (OverlayState = {}));
//# sourceMappingURL=models.js.map