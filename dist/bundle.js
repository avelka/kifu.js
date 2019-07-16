/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/board.service.ts":
/*!******************************!*\
  !*** ./src/board.service.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");
/* harmony import */ var _rule_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");


class BoardService {
    constructor() {
        this.board = [];
        this.ruleService = new _rule_service__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.history = [];
        this.createPoint = (x, y, state = null) => ({ state: state, order: 0 });
        this.line = s => Array(s).fill('');
        this.at = (x, y) => this.board[x][y];
    }
    init(size) {
        this.history = [];
        this.board = this.line(size).map((_, x) => this.line(size)).map((_, x) => _.map((_, y) => this.createPoint(x, y)));
        return this;
    }
    play(x, y, order = this.history.length) {
        const validState = this.ruleService.validate(this.board, {
            state: order % 2 ? _models__WEBPACK_IMPORTED_MODULE_0__["State"].WHITE : _models__WEBPACK_IMPORTED_MODULE_0__["State"].BLACK,
            order: order,
            x: x,
            y: y
        });
        if (validState) {
            this.board = validState;
            this.history = [...this.history, Object.assign({}, validState[x][y])];
        }
        return this;
    }
    libertiesAt(x, y) {
        const m = this.at(x, y);
        return m ? this.ruleService.liberties(this.board, m).length : 0;
    }
    show() {
        // 
        console.log(this.board.map(l => l.map(p => p.state ? p.state : '')));
    }
}
/* harmony default export */ __webpack_exports__["default"] = (BoardService);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _board_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.service */ "./src/board.service.ts");

/* harmony default export */ __webpack_exports__["default"] = (_board_service__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/*! exports provided: APPNAME, VER, EMPTY, BLACK, WHITE, PASS, UNDO, ABANDON, NEXT, PREV, END, START, State */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "APPNAME", function() { return APPNAME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VER", function() { return VER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EMPTY", function() { return EMPTY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BLACK", function() { return BLACK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WHITE", function() { return WHITE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PASS", function() { return PASS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UNDO", function() { return UNDO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ABANDON", function() { return ABANDON; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NEXT", function() { return NEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PREV", function() { return PREV; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "END", function() { return END; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "START", function() { return START; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "State", function() { return State; });
const APPNAME = "tengen.js";
const VER = "0.1";
const EMPTY = null;
const BLACK = "black";
const WHITE = "white";
const PASS = "pass";
const UNDO = "undo";
const ABANDON = "abandon";
const NEXT = "next";
const PREV = "prev";
const END = "end_game";
const START = "start_game";
var State;
(function (State) {
    State["BLACK"] = "black";
    State["WHITE"] = "white";
    State["KO"] = "ko";
})(State || (State = {}));
/*
export const alphabet = (s = 26) => {
  return new Array(s).fill(1).map((_:any, i:number) => String.fromCharCode(97 + i));
};

export const a2n = (a : string) => {
  return alphabet().indexOf(a);
};
export const n2a = (n: number) => {
  return alphabet()[n];
};

export const toCoord = (node: { x: number; y: number }) => {
  const { x, y } = node;
  return n2a(x) + n2a(y);
};
export const fromSGFCoord = (sgfnode: any) => {
  const move = sgfnode.B || sgfnode.W;
  if (move) {
    const [x, y] = move.split("");
    return { x: a2n(x), y: a2n(y) };
  }
  return { x: null, y: null };
};

export interface Item {
  id?: any;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  author?: Player;
}
export interface Comment {
  order: number;
  text: string;
  time?: Date;
  move?: any;
}
export interface GameSettings extends Item {
  white: Player;
  black: Player;
  size: number;
  scores: ScoreBoard;
  title?: string;
  komi?: number;
  clock?: any;
  board?: any;
  event?: string;
  round?: number;
  date?: Date;
  location?: string;
  comments?: Comment[];
  tree?: any[];
  needConfirm: boolean;
}

export interface GameListItem {
  name: string;
  updated_at: any;
  timestamp: number;
  key: string;
}

export interface Player extends Item {
  name: string;
  rank?: string;
}

export interface ScoreBoard extends Item {
  black: Score | null;
  white: Score | null;
}

export interface Score extends Item {
  captured?: number;
  territory?: number;
}

export interface Move extends Item {
  x?: number;
  y?: number;
  player: any;
  state: any;
  leafs?: Move[];
  order?: number;
  inHistory?: boolean;
  captured?: Move[];
  played: boolean;
  comments?: any[];
  time?: number;
}
*/ 


/***/ }),

/***/ "./src/rule.service.ts":
/*!*****************************!*\
  !*** ./src/rule.service.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/models.ts");

class RuleService {
    validate(game, mv) {
        let nextState = [...game.slice()];
        const hasLiberties = m => this.liberties(nextState, m).length;
        const isCapturing = m => {
            const next = [...game.slice()];
            next[mv.x][mv.y] = mv;
            return this.captured(next, m).length;
        };
        const isKoProtected = m => game[m.x][m.y].state === _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO;
        const isFree = m => !game[m.x][m.y].state;
        const valid = m => isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m);
        const isKoSituation = m => m.captured.length === 1 && !this.liberties(nextState, m).length;
        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            const captured = this.captured(nextState, mv).reduce((c, i) => c.concat(i), []);
            nextState[mv.x][mv.y].captured = captured.slice();
            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO;
            }
            return captured.reduce((p, c) => {
                p[c.x][c.y].state = c.state === _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO
                    ? _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO : null;
                return p;
            }, nextState);
        }
        throw new Error(`${mv.x}:${mv.y} was not a valid move (${game[mv.x][mv.y].state})`);
    }
    resetKo(state) {
        return state.map(l => l.map(p => {
            p.state = p.state == _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO ? null : p.state;
            return p;
        }));
    }
    adjacent(board, move) {
        const end = board.length;
        const start = 0;
        return [
            move.y > start ? board[move.x][move.y - 1] : null,
            move.y < end ? board[move.x][move.y + 1] : null,
            move.x > start ? board[move.x - 1][move.y] : null,
            move.x < end ? board[move.x + 1][move.y] : null
        ].filter(i => i);
    }
    group(board, point, queue = [], visited = new Set()) {
        visited.add(`${point.x}:${point.y}`);
        return Array.from(new Set([
            point,
            ...queue,
            ...this.adjacent(board, point)
                .filter(n => !visited.has(`${n.x}:${n.y}`) && n.state === point.state)
                .map(n => this.group(board, n, queue, visited))
                .reduce((a, v) => a.concat(v), [])
        ]));
    }
    sliberties(board, move) {
        return this.adjacent(board, move).filter(i => !i.state);
    }
    liberties(board, move, cap) {
        return Array.from(new Set(this.group(board, move)
            .map(m => this.sliberties(board, m))
            .reduce((a, v) => a.concat(v), [])
            .filter(l => l.x !== move.x || l.y !== move.y)
            .filter(l => !cap || (l.x !== cap.x || l.y !== cap.y))));
    }
    captured(board, move) {
        return this.adjacent(board, move)
            .filter(m => m.state && m.state !== move.state)
            .filter(o => !this.liberties(board, o, move).length)
            .map(c => this.group(board, c));
    }
}
/* harmony default export */ __webpack_exports__["default"] = (RuleService);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JvYXJkLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3J1bGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFzQztBQUNHO0FBRXpDLE1BQU0sWUFBWTtJQUloQjtRQUhBLFVBQUssR0FBUSxFQUFFLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxJQUFJLHFEQUFXLEVBQUUsQ0FBQztRQUNoQyxZQUFPLEdBQVUsRUFBRSxDQUFDO1FBV3BCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25FLFNBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDOUIsT0FBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQVZ0QyxDQUFDO0lBRUQsSUFBSSxDQUFDLElBQUk7UUFDUCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkgsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBTUQsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTTtRQUNwQyxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZELEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyw2Q0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsNkNBQUssQ0FBQyxLQUFLO1lBQzVDLEtBQUssRUFB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RSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLDZDQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDL0MsT0FBTyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUVQLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDaEIsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDaEIsT0FBTztZQUNILElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDakQsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUMvQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQ2pELElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7U0FDbEQsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FB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O0NBQ0o7QUFDYywwRUFBVyxFQUFDIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHtTdGF0ZSwgTW92ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IFJ1bGVTZXJ2aWNlIGZyb20gXCIuL3J1bGUuc2VydmljZVwiO1xuXG5jbGFzcyBCb2FyZFNlcnZpY2Uge1xuICBib2FyZDogYW55ID0gW107XG4gIHJ1bGVTZXJ2aWNlID0gbmV3IFJ1bGVTZXJ2aWNlKCk7XG4gIGhpc3Rvcnk6IGFueVtdID0gW107XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBpbml0KHNpemUpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSBbXTtcbiAgICB0aGlzLmJvYXJkID0gdGhpcy5saW5lKHNpemUpLm1hcCgoXywgeCkgPT4gdGhpcy5saW5lKHNpemUpKS5tYXAoKF8sIHgpID0+IF8ubWFwKChfLCB5KSA9PiB0aGlzLmNyZWF0ZVBvaW50KHgsIHkpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjcmVhdGVQb2ludCA9ICh4LCB5LCBzdGF0ZSA9IG51bGwpID0+ICh7IHN0YXRlOiBzdGF0ZSwgb3JkZXI6IDAgfSk7XG4gIGxpbmUgPSBzID0+IEFycmF5KHMpLmZpbGwoJycpO1xuICBhdCA9ICh4LCB5KTogTW92ZSA9PiB0aGlzLmJvYXJkW3hdW3ldO1xuXG4gIHBsYXkoeCwgeSwgb3JkZXIgPSB0aGlzLmhpc3RvcnkubGVuZ3RoKSB7XG4gICAgY29uc3QgdmFsaWRTdGF0ZSA9IHRoaXMucnVsZVNlcnZpY2UudmFsaWRhdGUodGhpcy5ib2FyZCwge1xuICAgICAgc3RhdGU6IG9yZGVyICUgMiA/IFN0YXRlLldISVRFIDogU3RhdGUuQkxBQ0ssXG4gICAgICBvcmRlcjogb3JkZXIsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0pXG5cbiAgICBpZiAodmFsaWRTdGF0ZSkge1xuICAgICAgdGhpcy5ib2FyZCA9IHZhbGlkU3RhdGU7XG4gICAgICB0aGlzLmhpc3RvcnkgPSBbLi4udGhpcy5oaXN0b3J5LCBPYmplY3QuYXNzaWduKHt9LCB2YWxpZFN0YXRlW3hdW3ldKV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGliZXJ0aWVzQXQoeCwgeSk6IG51bWJlciB7XG4gICAgY29uc3QgbSA9IHRoaXMuYXQoeCwgeSk7XG4gICAgcmV0dXJuIG0gPyB0aGlzLnJ1bGVTZXJ2aWNlLmxpYmVydGllcyh0aGlzLmJvYXJkLCBtKS5sZW5ndGggOiAwO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICAvLyBcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkLm1hcChsID0+IGwubWFwKHAgPT4gcC5zdGF0ZSA/IHAuc3RhdGUgOiAnJykpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFNlcnZpY2U7IiwiaW1wb3J0IEJvYXJkU2VydmljZSBmcm9tIFwiLi9ib2FyZC5zZXJ2aWNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkU2VydmljZTsiLCJleHBvcnQgY29uc3QgQVBQTkFNRSA9IFwidGVuZ2VuLmpzXCI7XG5leHBvcnQgY29uc3QgVkVSID0gXCIwLjFcIjtcblxuZXhwb3J0IGNvbnN0IEVNUFRZOiBhbnkgPSBudWxsO1xuZXhwb3J0IGNvbnN0IEJMQUNLID0gXCJibGFja1wiO1xuZXhwb3J0IGNvbnN0IFdISVRFID0gXCJ3aGl0ZVwiO1xuZXhwb3J0IGNvbnN0IFBBU1MgPSBcInBhc3NcIjtcbmV4cG9ydCBjb25zdCBVTkRPID0gXCJ1bmRvXCI7XG5leHBvcnQgY29uc3QgQUJBTkRPTiA9IFwiYWJhbmRvblwiO1xuZXhwb3J0IGNvbnN0IE5FWFQgPSBcIm5leHRcIjtcbmV4cG9ydCBjb25zdCBQUkVWID0gXCJwcmV2XCI7XG5leHBvcnQgY29uc3QgRU5EID0gXCJlbmRfZ2FtZVwiO1xuZXhwb3J0IGNvbnN0IFNUQVJUID0gXCJzdGFydF9nYW1lXCI7XG5cbmV4cG9ydCBlbnVtIFN0YXRlIHtcbiAgQkxBQ0sgPSAnYmxhY2snLFxuICBXSElURSA9ICd3aGl0ZScsXG4gIEtPID0gJ2tvJyxcbn0gXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUge1xuICBzdGF0ZTogU3RhdGUgfCBudWxsLFxuICB1cGRhdGVkX2F0PzogRGF0ZSxcbiAgb3JkZXI6IG51bWJlciwgXG4gIHg6bnVtYmVyXG4gIHk6bnVtYmVyLFxuICBsb2c/OiBNb3ZlW10sXG4gIGNhcHR1cmVkPzogW11cbn1cblxuLypcbmV4cG9ydCBjb25zdCBhbHBoYWJldCA9IChzID0gMjYpID0+IHtcbiAgcmV0dXJuIG5ldyBBcnJheShzKS5maWxsKDEpLm1hcCgoXzphbnksIGk6bnVtYmVyKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGEybiA9IChhIDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpLmluZGV4T2YoYSk7XG59O1xuZXhwb3J0IGNvbnN0IG4yYSA9IChuOiBudW1iZXIpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KClbbl07XG59O1xuXG5leHBvcnQgY29uc3QgdG9Db29yZCA9IChub2RlOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcbiAgY29uc3QgeyB4LCB5IH0gPSBub2RlO1xuICByZXR1cm4gbjJhKHgpICsgbjJhKHkpO1xufTtcbmV4cG9ydCBjb25zdCBmcm9tU0dGQ29vcmQgPSAoc2dmbm9kZTogYW55KSA9PiB7XG4gIGNvbnN0IG1vdmUgPSBzZ2Zub2RlLkIgfHwgc2dmbm9kZS5XO1xuICBpZiAobW92ZSkge1xuICAgIGNvbnN0IFt4LCB5XSA9IG1vdmUuc3BsaXQoXCJcIik7XG4gICAgcmV0dXJuIHsgeDogYTJuKHgpLCB5OiBhMm4oeSkgfTtcbiAgfVxuICByZXR1cm4geyB4OiBudWxsLCB5OiBudWxsIH07XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xuICBpZD86IGFueTtcbiAgY3JlYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIHVwZGF0ZWRBdD86IERhdGUgfCBudWxsO1xuICBkZWxldGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgYXV0aG9yPzogUGxheWVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBDb21tZW50IHtcbiAgb3JkZXI6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICB0aW1lPzogRGF0ZTtcbiAgbW92ZT86IGFueTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZVNldHRpbmdzIGV4dGVuZHMgSXRlbSB7XG4gIHdoaXRlOiBQbGF5ZXI7XG4gIGJsYWNrOiBQbGF5ZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgc2NvcmVzOiBTY29yZUJvYXJkO1xuICB0aXRsZT86IHN0cmluZztcbiAga29taT86IG51bWJlcjtcbiAgY2xvY2s/OiBhbnk7XG4gIGJvYXJkPzogYW55O1xuICBldmVudD86IHN0cmluZztcbiAgcm91bmQ/OiBudW1iZXI7XG4gIGRhdGU/OiBEYXRlO1xuICBsb2NhdGlvbj86IHN0cmluZztcbiAgY29tbWVudHM/OiBDb21tZW50W107XG4gIHRyZWU/OiBhbnlbXTtcbiAgbmVlZENvbmZpcm06IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZUxpc3RJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cGRhdGVkX2F0OiBhbnk7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICBrZXk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXIgZXh0ZW5kcyBJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICByYW5rPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlQm9hcmQgZXh0ZW5kcyBJdGVtIHtcbiAgYmxhY2s6IFNjb3JlIHwgbnVsbDtcbiAgd2hpdGU6IFNjb3JlIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZSBleHRlbmRzIEl0ZW0ge1xuICBjYXB0dXJlZD86IG51bWJlcjtcbiAgdGVycml0b3J5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUgZXh0ZW5kcyBJdGVtIHtcbiAgeD86IG51bWJlcjtcbiAgeT86IG51bWJlcjtcbiAgcGxheWVyOiBhbnk7XG4gIHN0YXRlOiBhbnk7XG4gIGxlYWZzPzogTW92ZVtdO1xuICBvcmRlcj86IG51bWJlcjtcbiAgaW5IaXN0b3J5PzogYm9vbGVhbjtcbiAgY2FwdHVyZWQ/OiBNb3ZlW107XG4gIHBsYXllZDogYm9vbGVhbjtcbiAgY29tbWVudHM/OiBhbnlbXTtcbiAgdGltZT86IG51bWJlcjtcbn1cbiovIiwiaW1wb3J0IHsgTW92ZSwgU3RhdGUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcblxuY2xhc3MgUnVsZVNlcnZpY2Uge1xuICAgIHZhbGlkYXRlKGdhbWUsIG12OiBNb3ZlKSB7XG4gICAgICAgIGxldCBuZXh0U3RhdGUgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICAgY29uc3QgaGFzTGliZXJ0aWVzID0gbSA9PiB0aGlzLmxpYmVydGllcyhuZXh0U3RhdGUsIG0pLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaXNDYXB0dXJpbmcgPSBtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICAgICAgIG5leHRbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhcHR1cmVkKG5leHQsIG0pLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBpc0tvUHJvdGVjdGVkID0gbSA9PiBnYW1lW20ueF1bbS55XS5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgY29uc3QgaXNGcmVlID0gbSA9PiAhZ2FtZVttLnhdW20ueV0uc3RhdGU7XG4gICAgICAgIGNvbnN0IHZhbGlkID0gbSA9PiBpc0ZyZWUobSkgJibCoChpc0NhcHR1cmluZyhtKSB8fCBoYXNMaWJlcnRpZXMobSkpICYmICFpc0tvUHJvdGVjdGVkKG0pO1xuICAgICAgICBjb25zdCBpc0tvU2l0dWF0aW9uID0gbSA9PiBtLmNhcHR1cmVkLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAodmFsaWQobXYpKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSB0aGlzLnJlc2V0S28obmV4dFN0YXRlKTtcbiAgICAgICAgICAgIG5leHRTdGF0ZVttdi54XVttdi55XSA9IG12O1xuICAgICAgICAgICAgY29uc3QgY2FwdHVyZWQgPSB0aGlzLmNhcHR1cmVkKG5leHRTdGF0ZSwgbXYpLnJlZHVjZSgoYywgaSkgPT4gYy5jb25jYXQoaSksIFtdKTtcbiAgICAgICAgICAgIG5leHRTdGF0ZVttdi54XVttdi55XS5jYXB0dXJlZCA9IGNhcHR1cmVkLnNsaWNlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpc0tvU2l0dWF0aW9uKG12KSkge1xuICAgICAgICAgICAgICAgIG5leHRTdGF0ZVtjYXB0dXJlZFswXS54XVtjYXB0dXJlZFswXS55XS5zdGF0ZSA9IFN0YXRlLktPO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY2FwdHVyZWQucmVkdWNlKChwLCBjKSA9PiB7XG4gICAgICAgICAgICAgICAgcFtjLnhdW2MueV0uc3RhdGUgPSBjLnN0YXRlID09PSBTdGF0ZS5LTyBcbiAgICAgICAgICAgICAgICAgICAgPyBTdGF0ZS5LTyA6IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9LCBuZXh0U3RhdGUpO1xuICAgICAgICB9IFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXYueH06JHttdi55fSB3YXMgbm90IGEgdmFsaWQgbW92ZSAoJHtnYW1lW212LnhdW212LnldLnN0YXRlfSlgKTtcbiAgICB9XG4gICAgcmVzZXRLbyhzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUubWFwKGwgPT4gbC5tYXAocCA9PiB7XG4gICAgICAgICAgIHAuc3RhdGUgPSBwLnN0YXRlID09IFN0YXRlLktPID8gbnVsbCA6IHAuc3RhdGU7IFxuICAgICAgICAgICByZXR1cm4gcDsgXG4gICAgICAgIH0pKVxuICAgICAgICBcbiAgICB9XG4gICAgYWRqYWNlbnQoYm9hcmQsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgZW5kID0gYm9hcmQubGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFydCA9IDA7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtb3ZlLnkgPiBzdGFydCA/IGJvYXJkW21vdmUueF1bbW92ZS55IC0gMV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS55IDwgZW5kID8gYm9hcmRbbW92ZS54XVttb3ZlLnkgKyAxXSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnggPiBzdGFydCA/IGJvYXJkW21vdmUueCAtIDFdW21vdmUueV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS54IDwgZW5kID8gYm9hcmRbbW92ZS54ICsgMV1bbW92ZS55XSA6IG51bGxcbiAgICAgICAgXS5maWx0ZXIoaSA9PiBpKTtcbiAgICB9XG5cbiAgICBncm91cChib2FyZCwgcG9pbnQ6IE1vdmUsIHF1ZXVlOiBNb3ZlW10gPSBbXSwgdmlzaXRlZCA9IG5ldyBTZXQoKSk6IE1vdmVbXSB7XG4gICAgICAgIHZpc2l0ZWQuYWRkKGAke3BvaW50Lnh9OiR7cG9pbnQueX1gKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFtcbiAgICAgICAgICAgICAgICBwb2ludCxcbiAgICAgICAgICAgICAgICAuLi5xdWV1ZSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmFkamFjZW50KGJvYXJkLCBwb2ludClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihuID0+ICF2aXNpdGVkLmhhcyhgJHtuLnh9OiR7bi55fWApICYmIG4uc3RhdGUgPT09IHBvaW50LnN0YXRlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKG4gPT4gdGhpcy5ncm91cChib2FyZCwgbiwgcXVldWUsIHZpc2l0ZWQpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCB2KSA9PiBhLmNvbmNhdCh2KSwgW10pXG4gICAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNsaWJlcnRpZXMoYm9hcmQsIG1vdmU6IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSkuZmlsdGVyKGkgPT4gIWkuc3RhdGUpO1xuICAgIH1cblxuICAgIGxpYmVydGllcyhib2FyZCwgbW92ZTogTW92ZSwgY2FwPzogTW92ZSk6IE1vdmVbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwKGJvYXJkLCBtb3ZlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5zbGliZXJ0aWVzKGJvYXJkLCBtKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGwgPT4gbC54ICE9PSBtb3ZlLnggfHwgbC55ICE9PSBtb3ZlLnkpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobCA9PiAhY2FwIHx8IChsLnggIT09IGNhcC54IHx8IGwueSAhPT0gY2FwLnkpKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNhcHR1cmVkKGJvYXJkLCBtb3ZlOiBNb3ZlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkamFjZW50KGJvYXJkLCBtb3ZlKVxuICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uc3RhdGUgJiYgbS5zdGF0ZSAhPT0gbW92ZS5zdGF0ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobyA9PiAhdGhpcy5saWJlcnRpZXMoYm9hcmQsIG8sIG1vdmUpLmxlbmd0aClcbiAgICAgICAgICAgIC5tYXAoYyA9PiB0aGlzLmdyb3VwKGJvYXJkLCBjKSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUnVsZVNlcnZpY2U7Il0sInNvdXJjZVJvb3QiOiIifQ==