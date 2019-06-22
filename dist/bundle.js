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
    }
    initBoard(size) {
        this.history = [];
        this.board = this.line(size).map(() => this.line(size));
        return this;
    }
    createPoint(state = null) {
        return {
            state: state,
            order: 0
            //   updated_at: new Date()
        };
    }
    line(s) {
        return Array(s).fill(this.createPoint());
    }
    play(x, y) {
        const order = this.history.length;
        const move = {
            state: order % 2 ? _models__WEBPACK_IMPORTED_MODULE_0__["State"].WHITE : _models__WEBPACK_IMPORTED_MODULE_0__["State"].BLACK,
            order: order,
            x: x,
            y: y
        };
        const validState = this.ruleService.validate(this.board, move);
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
    at(x, y) {
        return this.board[x][y];
    }
    show() {
        console.log(this.board);
    }
}
/* harmony default export */ __webpack_exports__["default"] = (BoardService);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _board_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board.service */ "./src/board.service.ts");

const gb = new _board_service__WEBPACK_IMPORTED_MODULE_0__["default"]();
gb.initBoard(9)
    .play(1, 0)
    .play(0, 0);


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
    validate(game, m) {
        const nextState = [...game.slice()];
        const hasLiberties = m => this.groupLiberties(nextState, m).length;
        const isCapturing = m => this.captured(nextState, m).length;
        const isKo = m => game[m.x][m.y].state === _models__WEBPACK_IMPORTED_MODULE_0__["State"].KO;
        const isNotFree = m => game[m.x][m.y].state;
        const valid = (m) => !isNotFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKo(m);
        if (valid(m)) {
            nextState[m.x][m.y] = m;
            const captured = this.captured(nextState, m).reduce((c, i) => [...c, ...i], []);
            nextState[m.x][m.y].captured = [...captured];
            return captured.reduce((p, c) => p[c.x][c.y].state = null, nextState);
        }
        throw new Error(`${m.x}:${m.y} was not a valid move (${game[m.x][m.y].state})`);
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
    liberties(board, move) {
        return this.adjacent(board, move).filter(i => !i.state);
    }
    groupLiberties(board, move, cap = null) {
        return Array.from(new Set(this.group(board, move)
            .map(m => this.liberties(board, m))
            .reduce((a, v) => a.concat(v), [])
            .filter(l => l.x !== move.x || l.y !== move.y)
            .filter(l => !cap || (l.x !== cap.x || l.y !== cap.y))));
    }
    captured(board, move) {
        return this.adjacent(board, move)
            .filter(m => m.state && m.state !== move.state)
            .filter(o => !this.groupLiberties(board, o, move).length)
            .map(c => this.group(board, c));
    }
}
/* harmony default export */ __webpack_exports__["default"] = (RuleService);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JvYXJkLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3J1bGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFvRTtBQUMzQjtBQUV6QyxNQUFNLFlBQVk7SUFJaEI7UUFIQSxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsSUFBSSxxREFBVyxFQUFFLENBQUM7UUFDaEMsWUFBTyxHQUFHLEVBQUUsQ0FBQztJQUdiLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBSTtRQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFD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LENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzdDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzdELENBQ0osQ0FBQztJQUNOLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBSyxFQUFFLElBQVU7UUFDdEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7YUFDNUIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDOUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDO2FBQ3hELEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNKO0FBQ2MsMEVBQVcsRUFBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImltcG9ydCB7IEJMQUNLLCBXSElURSwgUEFTUywgQUJBTkRPTiwgU3RhdGUsIE1vdmUgfSBmcm9tIFwiLi9tb2RlbHNcIjtcbmltcG9ydCBSdWxlU2VydmljZSBmcm9tIFwiLi9ydWxlLnNlcnZpY2VcIjtcblxuY2xhc3MgQm9hcmRTZXJ2aWNlIHtcbiAgYm9hcmQ6IGFueSA9IFtdO1xuICBydWxlU2VydmljZSA9IG5ldyBSdWxlU2VydmljZSgpO1xuICBoaXN0b3J5ID0gW107XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBpbml0Qm9hcmQoc2l6ZSkge1xuICAgIHRoaXMuaGlzdG9yeSA9IFtdO1xuICAgIHRoaXMuYm9hcmQgPSB0aGlzLmxpbmUoc2l6ZSkubWFwKCgpID0+IHRoaXMubGluZShzaXplKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjcmVhdGVQb2ludChzdGF0ZSA9IG51bGwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAgb3JkZXI6IDBcbiAgICAgIC8vICAgdXBkYXRlZF9hdDogbmV3IERhdGUoKVxuICAgIH1cbiAgfVxuICBsaW5lKHMpIHtcbiAgICByZXR1cm4gQXJyYXkocykuZmlsbCh0aGlzLmNyZWF0ZVBvaW50KCkpO1xuICB9XG5cbiAgcGxheSh4LCB5KSB7XG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLmhpc3RvcnkubGVuZ3RoO1xuICAgIGNvbnN0IG1vdmUgPSB7XG4gICAgICBzdGF0ZTogb3JkZXIgJSAyID8gU3RhdGUuV0hJVEUgOiBTdGF0ZS5CTEFDSyxcbiAgICAgIG9yZGVyOiBvcmRlcixcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfTtcbiAgICBjb25zdCB2YWxpZFN0YXRlID0gdGhpcy5ydWxlU2VydmljZS52YWxpZGF0ZSh0aGlzLmJvYXJkLCBtb3ZlKVxuXG4gICAgaWYgKHZhbGlkU3RhdGUpIHtcbiAgICAgIHRoaXMuYm9hcmQgPSB2YWxpZFN0YXRlO1xuICAgICAgdGhpcy5oaXN0b3J5ID0gWy4uLnRoaXMuaGlzdG9yeSwgT2JqZWN0LmFzc2lnbih7fSwgdmFsaWRTdGF0ZVt4XVt5XSldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpczsgICAgXG4gIH1cblxuICBsaWJlcnRpZXNBdCh4LCB5KTogbnVtYmVyIHtcbiAgICBjb25zdCBtID0gdGhpcy5hdCh4LCB5KTtcbiAgICByZXR1cm4gbSA/IHRoaXMucnVsZVNlcnZpY2UubGliZXJ0aWVzKHRoaXMuYm9hcmQsIG0pLmxlbmd0aCA6IDA7XG4gIH1cblxuICBhdCh4LCB5KTogTW92ZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmJvYXJkW3hdW3ldO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFNlcnZpY2U7IiwiaW1wb3J0IEJvYXJkU2VydmljZSBmcm9tIFwiLi9ib2FyZC5zZXJ2aWNlXCI7XG5cblxuY29uc3QgZ2IgPSBuZXcgQm9hcmRTZXJ2aWNlKCk7XG5nYi5pbml0Qm9hcmQoOSlcbiAgICAucGxheSgxLCAwKVxuICAgIC5wbGF5KDAsIDApOyIsImV4cG9ydCBjb25zdCBBUFBOQU1FID0gXCJ0ZW5nZW4uanNcIjtcbmV4cG9ydCBjb25zdCBWRVIgPSBcIjAuMVwiO1xuXG5leHBvcnQgY29uc3QgRU1QVFk6IGFueSA9IG51bGw7XG5leHBvcnQgY29uc3QgQkxBQ0sgPSBcImJsYWNrXCI7XG5leHBvcnQgY29uc3QgV0hJVEUgPSBcIndoaXRlXCI7XG5leHBvcnQgY29uc3QgUEFTUyA9IFwicGFzc1wiO1xuZXhwb3J0IGNvbnN0IFVORE8gPSBcInVuZG9cIjtcbmV4cG9ydCBjb25zdCBBQkFORE9OID0gXCJhYmFuZG9uXCI7XG5leHBvcnQgY29uc3QgTkVYVCA9IFwibmV4dFwiO1xuZXhwb3J0IGNvbnN0IFBSRVYgPSBcInByZXZcIjtcbmV4cG9ydCBjb25zdCBFTkQgPSBcImVuZF9nYW1lXCI7XG5leHBvcnQgY29uc3QgU1RBUlQgPSBcInN0YXJ0X2dhbWVcIjtcblxuZXhwb3J0IGVudW0gU3RhdGUge1xuICBCTEFDSyA9ICdibGFjaycsXG4gIFdISVRFID0gJ3doaXRlJyxcbiAgS08gPSAna28nLFxufSBcbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSB7XG4gIHN0YXRlOiBTdGF0ZSB8IG51bGwsXG4gIHVwZGF0ZWRfYXQ/OiBEYXRlLFxuICBvcmRlcjogbnVtYmVyLCBcbiAgeDpudW1iZXJcbiAgeTpudW1iZXIsXG4gIGxvZz86IE1vdmVbXSxcbiAgY2FwdHVyZWQ/OiBbXVxufVxuXG4vKlxuZXhwb3J0IGNvbnN0IGFscGhhYmV0ID0gKHMgPSAyNikgPT4ge1xuICByZXR1cm4gbmV3IEFycmF5KHMpLmZpbGwoMSkubWFwKChfOmFueSwgaTpudW1iZXIpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpKSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTJuID0gKGEgOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KCkuaW5kZXhPZihhKTtcbn07XG5leHBvcnQgY29uc3QgbjJhID0gKG46IG51bWJlcikgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKVtuXTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b0Nvb3JkID0gKG5vZGU6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xuICBjb25zdCB7IHgsIHkgfSA9IG5vZGU7XG4gIHJldHVybiBuMmEoeCkgKyBuMmEoeSk7XG59O1xuZXhwb3J0IGNvbnN0IGZyb21TR0ZDb29yZCA9IChzZ2Zub2RlOiBhbnkpID0+IHtcbiAgY29uc3QgbW92ZSA9IHNnZm5vZGUuQiB8fCBzZ2Zub2RlLlc7XG4gIGlmIChtb3ZlKSB7XG4gICAgY29uc3QgW3gsIHldID0gbW92ZS5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4geyB4OiBhMm4oeCksIHk6IGEybih5KSB9O1xuICB9XG4gIHJldHVybiB7IHg6IG51bGwsIHk6IG51bGwgfTtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XG4gIGlkPzogYW55O1xuICBjcmVhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgdXBkYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGRlbGV0ZWRBdD86IERhdGUgfCBudWxsO1xuICBhdXRob3I/OiBQbGF5ZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnQge1xuICBvcmRlcjogbnVtYmVyO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHRpbWU/OiBEYXRlO1xuICBtb3ZlPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBHYW1lU2V0dGluZ3MgZXh0ZW5kcyBJdGVtIHtcbiAgd2hpdGU6IFBsYXllcjtcbiAgYmxhY2s6IFBsYXllcjtcbiAgc2l6ZTogbnVtYmVyO1xuICBzY29yZXM6IFNjb3JlQm9hcmQ7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBrb21pPzogbnVtYmVyO1xuICBjbG9jaz86IGFueTtcbiAgYm9hcmQ/OiBhbnk7XG4gIGV2ZW50Pzogc3RyaW5nO1xuICByb3VuZD86IG51bWJlcjtcbiAgZGF0ZT86IERhdGU7XG4gIGxvY2F0aW9uPzogc3RyaW5nO1xuICBjb21tZW50cz86IENvbW1lbnRbXTtcbiAgdHJlZT86IGFueVtdO1xuICBuZWVkQ29uZmlybTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHYW1lTGlzdEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHVwZGF0ZWRfYXQ6IGFueTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIGtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllciBleHRlbmRzIEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJhbms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmVCb2FyZCBleHRlbmRzIEl0ZW0ge1xuICBibGFjazogU2NvcmUgfCBudWxsO1xuICB3aGl0ZTogU2NvcmUgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlIGV4dGVuZHMgSXRlbSB7XG4gIGNhcHR1cmVkPzogbnVtYmVyO1xuICB0ZXJyaXRvcnk/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSBleHRlbmRzIEl0ZW0ge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuICBwbGF5ZXI6IGFueTtcbiAgc3RhdGU6IGFueTtcbiAgbGVhZnM/OiBNb3ZlW107XG4gIG9yZGVyPzogbnVtYmVyO1xuICBpbkhpc3Rvcnk/OiBib29sZWFuO1xuICBjYXB0dXJlZD86IE1vdmVbXTtcbiAgcGxheWVkOiBib29sZWFuO1xuICBjb21tZW50cz86IGFueVtdO1xuICB0aW1lPzogbnVtYmVyO1xufVxuKi8iLCJpbXBvcnQgeyBNb3ZlLCBTdGF0ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuXG5jbGFzcyBSdWxlU2VydmljZSB7XG4gICAgdmFsaWRhdGUoZ2FtZSwgbTogTW92ZSkge1xuICAgICAgICBjb25zdCBuZXh0U3RhdGUgPSBbLi4uZ2FtZS5zbGljZSgpXTtcbiAgICAgICBcblxuICAgICAgICBjb25zdCBoYXNMaWJlcnRpZXMgPSBtID0+IHRoaXMuZ3JvdXBMaWJlcnRpZXMobmV4dFN0YXRlLCBtKS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGlzQ2FwdHVyaW5nID0gbSA9PiB0aGlzLmNhcHR1cmVkKG5leHRTdGF0ZSwgbSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBpc0tvID0gbSA9PiBnYW1lW20ueF1bbS55XS5zdGF0ZSA9PT0gU3RhdGUuS09cbiAgICAgICAgY29uc3QgaXNOb3RGcmVlID0gbSA9PiBnYW1lW20ueF1bbS55XS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdmFsaWQgPSAobSkgPT4gIWlzTm90RnJlZShtKSAmJiAoaXNDYXB0dXJpbmcobSkgfHwgaGFzTGliZXJ0aWVzKG0pKSAmJiAhaXNLbyhtKTtcbiAgICAgICAgaWYgKHZhbGlkKG0pKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbS54XVttLnldID0gbTtcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkID0gdGhpcy5jYXB0dXJlZChuZXh0U3RhdGUsIG0pLnJlZHVjZSgoYywgaSkgPT4gWy4uLmMsIC4uLmldLCBbXSk7XG4gICAgICAgICAgICBuZXh0U3RhdGVbbS54XVttLnldLmNhcHR1cmVkID0gWy4uLmNhcHR1cmVkXTtcbiAgICAgICAgICAgIHJldHVybiBjYXB0dXJlZC5yZWR1Y2UoKHAsIGMpID0+IHBbYy54XVtjLnldLnN0YXRlID0gbnVsbCwgbmV4dFN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7bS54fToke20ueX0gd2FzIG5vdCBhIHZhbGlkIG1vdmUgKCR7Z2FtZVttLnhdW20ueV0uc3RhdGV9KWApO1xuICAgIH1cbiAgIFxuICAgIGFkamFjZW50KGJvYXJkLCBtb3ZlKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGJvYXJkLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSAwO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgbW92ZS55ID4gc3RhcnQgPyBib2FyZFttb3ZlLnhdW21vdmUueSAtIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueSA8IGVuZCA/IGJvYXJkW21vdmUueF1bbW92ZS55ICsgMV0gOiBudWxsLFxuICAgICAgICAgICAgbW92ZS54ID4gc3RhcnQgPyBib2FyZFttb3ZlLnggLSAxXVttb3ZlLnldIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA8IGVuZCA/IGJvYXJkW21vdmUueCArIDFdW21vdmUueV0gOiBudWxsXG4gICAgICAgIF0uZmlsdGVyKGkgPT4gaSk7XG4gICAgfVxuXG4gICAgZ3JvdXAoYm9hcmQsIHBvaW50OiBNb3ZlLCBxdWV1ZTogTW92ZVtdID0gW10sIHZpc2l0ZWQgPSBuZXcgU2V0KCkpOiBNb3ZlW10ge1xuICAgICAgICB2aXNpdGVkLmFkZChgJHtwb2ludC54fToke3BvaW50Lnl9YCk7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKFxuICAgICAgICAgICAgbmV3IFNldChbXG4gICAgICAgICAgICAgICAgcG9pbnQsXG4gICAgICAgICAgICAgICAgLi4ucXVldWUsXG4gICAgICAgICAgICAgICAgLi4udGhpcy5hZGphY2VudChib2FyZCwgcG9pbnQpXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiAhdmlzaXRlZC5oYXMoYCR7bi54fToke24ueX1gKSAmJiBuLnN0YXRlID09PSBwb2ludC5zdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgLm1hcChuID0+IHRoaXMuZ3JvdXAoYm9hcmQsIG4sIHF1ZXVlLCB2aXNpdGVkKSlcbiAgICAgICAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgdikgPT4gYS5jb25jYXQodiksIFtdKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBsaWJlcnRpZXMoYm9hcmQsIG1vdmU6IE1vdmUpOiBNb3ZlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSkuZmlsdGVyKGkgPT4gIWkuc3RhdGUpO1xuICAgIH1cblxuICAgIGdyb3VwTGliZXJ0aWVzKGJvYXJkLCBtb3ZlOiBNb3ZlLCBjYXAgPSBudWxsKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXAoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLmxpYmVydGllcyhib2FyZCwgbSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIHYpID0+IGEuY29uY2F0KHYpLCBbXSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+IGwueCAhPT0gbW92ZS54IHx8IGwueSAhPT0gbW92ZS55KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGwgPT4gIWNhcCB8fCAobC54ICE9PSBjYXAueCB8fCBsLnkgIT09IGNhcC55KSlcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBjYXB0dXJlZChib2FyZCwgbW92ZTogTW92ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGphY2VudChib2FyZCwgbW92ZSlcbiAgICAgICAgICAgIC5maWx0ZXIobSA9PiBtLnN0YXRlICYmIG0uc3RhdGUgIT09IG1vdmUuc3RhdGUpXG4gICAgICAgICAgICAuZmlsdGVyKG8gPT4gIXRoaXMuZ3JvdXBMaWJlcnRpZXMoYm9hcmQsIG8sIG1vdmUpLmxlbmd0aClcbiAgICAgICAgICAgIC5tYXAoYyA9PiB0aGlzLmdyb3VwKGJvYXJkLCBjKSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUnVsZVNlcnZpY2U7Il0sInNvdXJjZVJvb3QiOiIifQ==