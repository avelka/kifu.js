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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
const rule_service_1 = __webpack_require__(/*! ./rule.service */ "./src/rule.service.ts");
class BoardService {
    constructor() {
        this.board = [];
        this.ruleService = new rule_service_1.default();
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
            state: order % 2 ? models_1.State.WHITE : models_1.State.BLACK,
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
exports.default = BoardService;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./board.service */ "./src/board.service.ts"));


/***/ }),

/***/ "./src/models.ts":
/*!***********************!*\
  !*** ./src/models.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.APPNAME = "tengen.js";
exports.VER = "0.1";
exports.EMPTY = null;
exports.BLACK = "black";
exports.WHITE = "white";
exports.PASS = "pass";
exports.UNDO = "undo";
exports.ABANDON = "abandon";
exports.NEXT = "next";
exports.PREV = "prev";
exports.END = "end_game";
exports.START = "start_game";
var State;
(function (State) {
    State["BLACK"] = "black";
    State["WHITE"] = "white";
    State["KO"] = "ko";
})(State = exports.State || (exports.State = {}));
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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __webpack_require__(/*! ./models */ "./src/models.ts");
class RuleService {
    validate(game, mv) {
        let nextState = [...game.slice()];
        const hasLiberties = m => this.liberties(nextState, m).length;
        const isCapturing = m => {
            const next = [...game.slice()];
            next[mv.x][mv.y] = mv;
            return this.captured(next, m).length;
        };
        const isKoProtected = m => game[m.x][m.y].state === models_1.State.KO;
        const isFree = m => !game[m.x][m.y].state;
        const valid = m => isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m);
        const isKoSituation = m => m.captured.length === 1 && !this.liberties(nextState, m).length;
        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            const captured = this.captured(nextState, mv).reduce((c, i) => c.concat(i), []);
            nextState[mv.x][mv.y].captured = captured.slice();
            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = models_1.State.KO;
            }
            return captured.reduce((p, c) => {
                p[c.x][c.y].state = c.state === models_1.State.KO
                    ? models_1.State.KO : null;
                return p;
            }, nextState);
        }
        throw new Error(`${mv.x}:${mv.y} was not a valid move (${game[mv.x][mv.y].state})`);
    }
    resetKo(state) {
        return state.map(l => l.map(p => {
            p.state = p.state == models_1.State.KO ? null : p.state;
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
exports.default = RuleService;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JvYXJkLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3J1bGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0VBQXNDO0FBQ3RDLDBGQUF5QztBQUV6QyxNQUFNLFlBQVk7SUFJaEI7UUFIQSxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsSUFBSSxzQkFBVyxFQUFFLENBQUM7UUFDaEMsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQVdwQixnQkFBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFLEVB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YUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzthQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM3RCxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFVO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO2FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNuRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDSjtBQUNELGtCQUFlLFdBQVcsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7U3RhdGUsIE1vdmUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCBSdWxlU2VydmljZSBmcm9tIFwiLi9ydWxlLnNlcnZpY2VcIjtcblxuY2xhc3MgQm9hcmRTZXJ2aWNlIHtcbiAgYm9hcmQ6IGFueSA9IFtdO1xuICBydWxlU2VydmljZSA9IG5ldyBSdWxlU2VydmljZSgpO1xuICBoaXN0b3J5OiBhbnlbXSA9IFtdO1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICB9XG5cbiAgaW5pdChzaXplKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gW107XG4gICAgdGhpcy5ib2FyZCA9IHRoaXMubGluZShzaXplKS5tYXAoKF8sIHgpID0+IHRoaXMubGluZShzaXplKSkubWFwKChfLCB4KSA9PiBfLm1hcCgoXywgeSkgPT4gdGhpcy5jcmVhdGVQb2ludCh4LCB5KSkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3JlYXRlUG9pbnQgPSAoeCwgeSwgc3RhdGUgPSBudWxsKSA9PiAoeyBzdGF0ZTogc3RhdGUsIG9yZGVyOiAwIH0pO1xuICBsaW5lID0gcyA9PiBBcnJheShzKS5maWxsKCcnKTtcbiAgYXQgPSAoeCwgeSk6IE1vdmUgPT4gdGhpcy5ib2FyZFt4XVt5XTtcblxuICBwbGF5KHgsIHksIG9yZGVyID0gdGhpcy5oaXN0b3J5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbGlkU3RhdGUgPSB0aGlzLnJ1bGVTZXJ2aWNlLnZhbGlkYXRlKHRoaXMuYm9hcmQsIHtcbiAgICAgIHN0YXRlOiBvcmRlciAlIDIgPyBTdGF0ZS5XSElURSA6IFN0YXRlLkJMQUNLLFxuICAgICAgb3JkZXI6IG9yZGVyLFxuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KVxuXG4gICAgaWYgKHZhbGlkU3RhdGUpIHtcbiAgICAgIHRoaXMuYm9hcmQgPSB2YWxpZFN0YXRlO1xuICAgICAgdGhpcy5oaXN0b3J5ID0gWy4uLnRoaXMuaGlzdG9yeSwgT2JqZWN0LmFzc2lnbih7fSwgdmFsaWRTdGF0ZVt4XVt5XSldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpYmVydGllc0F0KHgsIHkpOiBudW1iZXIge1xuICAgIGNvbnN0IG0gPSB0aGlzLmF0KHgsIHkpO1xuICAgIHJldHVybiBtID8gdGhpcy5ydWxlU2VydmljZS5saWJlcnRpZXModGhpcy5ib2FyZCwgbSkubGVuZ3RoIDogMDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgLy8gXG4gICAgY29uc29sZS5sb2codGhpcy5ib2FyZC5tYXAobCA9PiBsLm1hcChwID0+IHAuc3RhdGUgPyBwLnN0YXRlIDogJycpKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9hcmRTZXJ2aWNlOyIsImV4cG9ydCAqIGZyb20gXCIuL2JvYXJkLnNlcnZpY2VcIjsiLCJleHBvcnQgY29uc3QgQVBQTkFNRSA9IFwidGVuZ2VuLmpzXCI7XG5leHBvcnQgY29uc3QgVkVSID0gXCIwLjFcIjtcblxuZXhwb3J0IGNvbnN0IEVNUFRZOiBhbnkgPSBudWxsO1xuZXhwb3J0IGNvbnN0IEJMQUNLID0gXCJibGFja1wiO1xuZXhwb3J0IGNvbnN0IFdISVRFID0gXCJ3aGl0ZVwiO1xuZXhwb3J0IGNvbnN0IFBBU1MgPSBcInBhc3NcIjtcbmV4cG9ydCBjb25zdCBVTkRPID0gXCJ1bmRvXCI7XG5leHBvcnQgY29uc3QgQUJBTkRPTiA9IFwiYWJhbmRvblwiO1xuZXhwb3J0IGNvbnN0IE5FWFQgPSBcIm5leHRcIjtcbmV4cG9ydCBjb25zdCBQUkVWID0gXCJwcmV2XCI7XG5leHBvcnQgY29uc3QgRU5EID0gXCJlbmRfZ2FtZVwiO1xuZXhwb3J0IGNvbnN0IFNUQVJUID0gXCJzdGFydF9nYW1lXCI7XG5cbmV4cG9ydCBlbnVtIFN0YXRlIHtcbiAgQkxBQ0sgPSAnYmxhY2snLFxuICBXSElURSA9ICd3aGl0ZScsXG4gIEtPID0gJ2tvJyxcbn0gXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUge1xuICBzdGF0ZTogU3RhdGUgfCBudWxsLFxuICB1cGRhdGVkX2F0PzogRGF0ZSxcbiAgb3JkZXI6IG51bWJlciwgXG4gIHg6bnVtYmVyXG4gIHk6bnVtYmVyLFxuICBsb2c/OiBNb3ZlW10sXG4gIGNhcHR1cmVkPzogW11cbn1cblxuLypcbmV4cG9ydCBjb25zdCBhbHBoYWJldCA9IChzID0gMjYpID0+IHtcbiAgcmV0dXJuIG5ldyBBcnJheShzKS5maWxsKDEpLm1hcCgoXzphbnksIGk6bnVtYmVyKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgaSkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGEybiA9IChhIDogc3RyaW5nKSA9PiB7XG4gIHJldHVybiBhbHBoYWJldCgpLmluZGV4T2YoYSk7XG59O1xuZXhwb3J0IGNvbnN0IG4yYSA9IChuOiBudW1iZXIpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KClbbl07XG59O1xuXG5leHBvcnQgY29uc3QgdG9Db29yZCA9IChub2RlOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0pID0+IHtcbiAgY29uc3QgeyB4LCB5IH0gPSBub2RlO1xuICByZXR1cm4gbjJhKHgpICsgbjJhKHkpO1xufTtcbmV4cG9ydCBjb25zdCBmcm9tU0dGQ29vcmQgPSAoc2dmbm9kZTogYW55KSA9PiB7XG4gIGNvbnN0IG1vdmUgPSBzZ2Zub2RlLkIgfHwgc2dmbm9kZS5XO1xuICBpZiAobW92ZSkge1xuICAgIGNvbnN0IFt4LCB5XSA9IG1vdmUuc3BsaXQoXCJcIik7XG4gICAgcmV0dXJuIHsgeDogYTJuKHgpLCB5OiBhMm4oeSkgfTtcbiAgfVxuICByZXR1cm4geyB4OiBudWxsLCB5OiBudWxsIH07XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEl0ZW0ge1xuICBpZD86IGFueTtcbiAgY3JlYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIHVwZGF0ZWRBdD86IERhdGUgfCBudWxsO1xuICBkZWxldGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgYXV0aG9yPzogUGxheWVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBDb21tZW50IHtcbiAgb3JkZXI6IG51bWJlcjtcbiAgdGV4dDogc3RyaW5nO1xuICB0aW1lPzogRGF0ZTtcbiAgbW92ZT86IGFueTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZVNldHRpbmdzIGV4dGVuZHMgSXRlbSB7XG4gIHdoaXRlOiBQbGF5ZXI7XG4gIGJsYWNrOiBQbGF5ZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgc2NvcmVzOiBTY29yZUJvYXJkO1xuICB0aXRsZT86IHN0cmluZztcbiAga29taT86IG51bWJlcjtcbiAgY2xvY2s/OiBhbnk7XG4gIGJvYXJkPzogYW55O1xuICBldmVudD86IHN0cmluZztcbiAgcm91bmQ/OiBudW1iZXI7XG4gIGRhdGU/OiBEYXRlO1xuICBsb2NhdGlvbj86IHN0cmluZztcbiAgY29tbWVudHM/OiBDb21tZW50W107XG4gIHRyZWU/OiBhbnlbXTtcbiAgbmVlZENvbmZpcm06IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZUxpc3RJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cGRhdGVkX2F0OiBhbnk7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xuICBrZXk6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQbGF5ZXIgZXh0ZW5kcyBJdGVtIHtcbiAgbmFtZTogc3RyaW5nO1xuICByYW5rPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlQm9hcmQgZXh0ZW5kcyBJdGVtIHtcbiAgYmxhY2s6IFNjb3JlIHwgbnVsbDtcbiAgd2hpdGU6IFNjb3JlIHwgbnVsbDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTY29yZSBleHRlbmRzIEl0ZW0ge1xuICBjYXB0dXJlZD86IG51bWJlcjtcbiAgdGVycml0b3J5PzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1vdmUgZXh0ZW5kcyBJdGVtIHtcbiAgeD86IG51bWJlcjtcbiAgeT86IG51bWJlcjtcbiAgcGxheWVyOiBhbnk7XG4gIHN0YXRlOiBhbnk7XG4gIGxlYWZzPzogTW92ZVtdO1xuICBvcmRlcj86IG51bWJlcjtcbiAgaW5IaXN0b3J5PzogYm9vbGVhbjtcbiAgY2FwdHVyZWQ/OiBNb3ZlW107XG4gIHBsYXllZDogYm9vbGVhbjtcbiAgY29tbWVudHM/OiBhbnlbXTtcbiAgdGltZT86IG51bWJlcjtcbn1cbiovIiwiaW1wb3J0IHsgTW92ZSwgU3RhdGUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcblxuY2xhc3MgUnVsZVNlcnZpY2Uge1xuICAgIHZhbGlkYXRlKGdhbWUsIG12OiBNb3ZlKSB7XG4gICAgICAgIGxldCBuZXh0U3RhdGUgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICAgY29uc3QgaGFzTGliZXJ0aWVzID0gbSA9PiB0aGlzLmxpYmVydGllcyhuZXh0U3RhdGUsIG0pLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaXNDYXB0dXJpbmcgPSBtID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICAgICAgIG5leHRbbXYueF1bbXYueV0gPSBtdjtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhcHR1cmVkKG5leHQsIG0pLmxlbmd0aFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBpc0tvUHJvdGVjdGVkID0gbSA9PiBnYW1lW20ueF1bbS55XS5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgY29uc3QgaXNGcmVlID0gbSA9PiAhZ2FtZVttLnhdW20ueV0uc3RhdGU7XG4gICAgICAgIGNvbnN0IHZhbGlkID0gbSA9PiBpc0ZyZWUobSkgJibCoChpc0NhcHR1cmluZyhtKSB8fCBoYXNMaWJlcnRpZXMobSkpICYmICFpc0tvUHJvdGVjdGVkKG0pO1xuICAgICAgICBjb25zdCBpc0tvU2l0dWF0aW9uID0gbSA9PiBtLmNhcHR1cmVkLmxlbmd0aCA9PT0gMSAmJiAhdGhpcy5saWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAodmFsaWQobXYpKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSB0aGlzLnJlc2V0S28obmV4dFN0YXRlKTtcbiAgICAgICAgICAgIG5leHRTdGF0ZVttdi54XVttdi55XSA9IG12O1xuICAgICAgICAgICAgY29uc3QgY2FwdHVyZWQgPSB0aGlzLmNhcHR1cmVkKG5leHRTdGF0ZSwgbXYpLnJlZHVjZSgoYywgaSkgPT4gYy5jb25jYXQoaSksIFtdKTtcbiAgICAgICAgICAgIG5leHRTdGF0ZVttdi54XVttdi55XS5jYXB0dXJlZCA9IGNhcHR1cmVkLnNsaWNlKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpc0tvU2l0dWF0aW9uKG12KSkge1xuICAgICAgICAgICAgICAgIG5leHRTdGF0ZVtjYXB0dXJlZFswXS54XVtjYXB0dXJlZFswXS55XS5zdGF0ZSA9IFN0YXRlLktPO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gY2FwdHVyZWQucmVkdWNlKChwLCBjKSA9PiB7XG4gICAgICAgICAgICAgICAgcFtjLnhdW2MueV0uc3RhdGUgPSBjLnN0YXRlID09PSBTdGF0ZS5LTyBcbiAgICAgICAgICAgICAgICAgICAgPyBTdGF0ZS5LTyA6IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHA7XG4gICAgICAgICAgICB9LCBuZXh0U3RhdGUpO1xuICAgICAgICB9IFxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bXYueH06JHttdi55fSB3YXMgbm90IGEgdmFsaWQgbW92ZSAoJHtnYW1lW212LnhdW212LnldLnN0YXRlfSlgKTtcbiAgICB9XG4gICAgcmVzZXRLbyhzdGF0ZSkge1xuICAgICAgICByZXR1cm4gc3RhdGUubWFwKGwgPT4gbC5tYXAocCA9PiB7XG4gICAgICAgICAgIHAuc3RhdGUgPSBwLnN0YXRlID09IFN0YXRlLktPID8gbnVsbCA6IHAuc3RhdGU7IFxuICAgICAgICAgICByZXR1cm4gcDsgXG4gICAgICAgIH0pKVxuICAgICAgICBcbiAgICB9XG4gICAgYWRqYWNlbnQoYm9hcmQsIG1vdmUpIHtcbiAgICAgICAgY29uc3QgZW5kID0gYm9hcmQubGVuZ3RoO1xuICAgICAgICBjb25zdCBzdGFydCA9IDA7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBtb3ZlLnkgPiBzdGFydCA/IGJvYXJkW21vdmUueF1bbW92ZS55IC0gMV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS55IDwgZW5kID8gYm9hcmRbbW92ZS54XVttb3ZlLnkgKyAxXSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnggPiBzdGFydCA/IGJvYXJkW21vdmUueCAtIDFdW21vdmUueV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS54IDwgZW5kID8gYm9hcmRbbW92ZS54ICsgMV1bbW92ZS55XSA6IG51bGxcbiAgICAgICAgXS5maWx0ZXIoaSA9PiBpKTtcbiAgICB9XG5cbiAgICBncm91cChib2FyZCwgcG9pbnQ6IE1vdmUsIHF1ZXVlOiBNb3ZlW10gPSBbXSwgdmlzaXRlZCA9IG5ldyBTZXQoKSk6IE1vdmVbXSB7XG4gICAgICAgIHZpc2l0ZWQuYWRkKGAke3BvaW50Lnh9OiR7cG9pbnQueX1gKTtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFtcbiAgICAgICAgICAgICAgICBwb2ludCxcbiAgICAgICAgICAgICAgICAuLi5xdWV1ZSxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmFkamFjZW50KGJvYXJkLCBwb2ludClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihuID0+ICF2aXNpdGVkLmhhcyhgJHtuLnh9OiR7bi55fWApICYmIG4uc3RhdGUgPT09IHBvaW50LnN0YXRlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKG4gPT4gdGhpcy5ncm91cChib2FyZCwgbiwgcXVldWUsIHZpc2l0ZWQpKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCB2KSA9PiBhLmNvbmNhdCh2KSwgW10pXG4gICAgICAgICAgICBdKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHNsaWJlcnRpZXMoYm9hcmQsIG1vdmU6IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSkuZmlsdGVyKGkgPT4gIWkuc3RhdGUpO1xuICAgIH1cblxuICAgIGxpYmVydGllcyhib2FyZCwgbW92ZTogTW92ZSwgY2FwPzogTW92ZSk6IE1vdmVbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwKGJvYXJkLCBtb3ZlKVxuICAgICAgICAgICAgICAgICAgICAubWFwKG0gPT4gdGhpcy5zbGliZXJ0aWVzKGJvYXJkLCBtKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGwgPT4gbC54ICE9PSBtb3ZlLnggfHwgbC55ICE9PSBtb3ZlLnkpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobCA9PiAhY2FwIHx8IChsLnggIT09IGNhcC54IHx8IGwueSAhPT0gY2FwLnkpKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGNhcHR1cmVkKGJvYXJkLCBtb3ZlOiBNb3ZlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkamFjZW50KGJvYXJkLCBtb3ZlKVxuICAgICAgICAgICAgLmZpbHRlcihtID0+IG0uc3RhdGUgJiYgbS5zdGF0ZSAhPT0gbW92ZS5zdGF0ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobyA9PiAhdGhpcy5saWJlcnRpZXMoYm9hcmQsIG8sIG1vdmUpLmxlbmd0aClcbiAgICAgICAgICAgIC5tYXAoYyA9PiB0aGlzLmdyb3VwKGJvYXJkLCBjKSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUnVsZVNlcnZpY2U7Il0sInNvdXJjZVJvb3QiOiIifQ==