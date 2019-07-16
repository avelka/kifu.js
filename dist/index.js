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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JvYXJkLnNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9tb2RlbHMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3J1bGUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNsRkEsd0VBQXNDO0FBQ3RDLDBGQUF5QztBQUV6QyxNQUFNLFlBQVk7SUFJaEI7UUFIQSxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcsSUFBSSxzQkFBVyxFQUFFLENBQUM7UUFDaEMsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQVdwQixnQkFBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNuRSxTQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLE9BQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFWdEMsQ0FBQztJQUVELElBQUksQ0FBQyxJQUFJO1FBQ1AsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU1ELElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU07UUFDcEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN2RCxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBSyxDQUFDLEtBQUs7WUFDNUMsS0FBSyxFQUFFLEtBQUs7WUFDWixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1NBQ0wsQ0FBQztRQUVGLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ2QsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELElBQUk7UUFDRixHQUFHO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQztDQUNGO0FBRUQsa0JBQWUsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQzVCLCtFQUFnQzs7Ozs7Ozs7Ozs7Ozs7O0FDQW5CLGVBQU8sR0FBRyxXQUFXLENBQUM7QUFDdEIsV0FBRyxHQUFHLEtBQUssQ0FBQztBQUVaLGFBQUssR0FBUSxJQUFJLENBQUM7QUFDbEIsYUFBSyxHQUFHLE9BQU8sQ0FBQztBQUNoQixhQUFLLEdBQUcsT0FBTyxDQUFDO0FBQ2hCLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsZUFBTyxHQUFHLFNBQVMsQ0FBQztBQUNwQixZQUFJLEdBQUcsTUFBTSxDQUFDO0FBQ2QsWUFBSSxHQUFHLE1BQU0sQ0FBQztBQUNkLFdBQUcsR0FBRyxVQUFVLENBQUM7QUFDakIsYUFBSyxHQUFHLFlBQVksQ0FBQztBQUVsQyxJQUFZLEtBSVg7QUFKRCxXQUFZLEtBQUs7SUFDZix3QkFBZTtJQUNmLHdCQUFlO0lBQ2Ysa0JBQVM7QUFDWCxDQUFDLEVBSlcsS0FBSyxHQUFMLGFBQUssS0FBTCxhQUFLLFFBSWhCO0FBV0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUEyRkU7Ozs7Ozs7Ozs7Ozs7OztBQ3hIRix3RUFBdUM7QUFFdkMsTUFBTSxXQUFXO0lBQ2IsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFRO1FBQ25CLElBQUksU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsQyxNQUFNLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUM5RCxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNwQixNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTTtRQUN4QyxDQUFDLENBQUM7UUFDRixNQUFNLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxjQUFLLENBQUMsRUFBRTtRQUM1RCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTNGLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ1gsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzNCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDaEYsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVsRCxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDbkIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLGNBQUssQ0FBQyxFQUFFLENBQUM7YUFDNUQ7WUFFRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxLQUFLLGNBQUssQ0FBQyxFQUFFO29CQUNwQyxDQUFDLENBQUMsY0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN0QixPQUFPLENBQUMsQ0FBQztZQUNiLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNqQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLDBCQUEwQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFDRCxPQUFPLENBQUMsS0FBSztRQUNULE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLGNBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvQyxPQUFPLENBQUMsQ0FBQztRQUNaLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQztJQUNELFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSTtRQUNoQixNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNoQixPQUFPO1lBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtZQUNqRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO1lBQy9DLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7WUFDakQsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUNsRCxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQVcsRUFBRSxRQUFnQixFQUFFLEVBQUUsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFO1FBQzdELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FDYixJQUFJLEdBQUcsQ0FBQztZQUNKLEtBQUs7WUFDTCxHQUFHLEtBQUs7WUFDUixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztpQkFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ3JFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1NBQ3pDLENBQUMsQ0FDTCxDQUFDO0lBQ04sQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLLEVBQUUsSUFBVTtRQUN4QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxTQUFTLENBQUMsS0FBSyxFQUFFLElBQVUsRUFBRSxHQUFVO1FBQ25DLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FDYixJQUFJLEdBQUcsQ0FDSCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7YUFDbEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDakMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzthQUM3QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUM3RCxDQUNKLENBQUM7SUFDTixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFVO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO2FBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzlDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQzthQUNuRCxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Q0FDSjtBQUNELGtCQUFlLFdBQVcsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW1wb3J0IHtTdGF0ZSwgTW92ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuaW1wb3J0IFJ1bGVTZXJ2aWNlIGZyb20gXCIuL3J1bGUuc2VydmljZVwiO1xuXG5jbGFzcyBCb2FyZFNlcnZpY2Uge1xuICBib2FyZDogYW55ID0gW107XG4gIHJ1bGVTZXJ2aWNlID0gbmV3IFJ1bGVTZXJ2aWNlKCk7XG4gIGhpc3Rvcnk6IGFueVtdID0gW107XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gIH1cblxuICBpbml0KHNpemUpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSBbXTtcbiAgICB0aGlzLmJvYXJkID0gdGhpcy5saW5lKHNpemUpLm1hcCgoXywgeCkgPT4gdGhpcy5saW5lKHNpemUpKS5tYXAoKF8sIHgpID0+IF8ubWFwKChfLCB5KSA9PiB0aGlzLmNyZWF0ZVBvaW50KHgsIHkpKSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjcmVhdGVQb2ludCA9ICh4LCB5LCBzdGF0ZSA9IG51bGwpID0+ICh7IHN0YXRlOiBzdGF0ZSwgb3JkZXI6IDAgfSk7XG4gIGxpbmUgPSBzID0+IEFycmF5KHMpLmZpbGwoJycpO1xuICBhdCA9ICh4LCB5KTogTW92ZSA9PiB0aGlzLmJvYXJkW3hdW3ldO1xuXG4gIHBsYXkoeCwgeSwgb3JkZXIgPSB0aGlzLmhpc3RvcnkubGVuZ3RoKSB7XG4gICAgY29uc3QgdmFsaWRTdGF0ZSA9IHRoaXMucnVsZVNlcnZpY2UudmFsaWRhdGUodGhpcy5ib2FyZCwge1xuICAgICAgc3RhdGU6IG9yZGVyICUgMiA/IFN0YXRlLldISVRFIDogU3RhdGUuQkxBQ0ssXG4gICAgICBvcmRlcjogb3JkZXIsXG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0pXG5cbiAgICBpZiAodmFsaWRTdGF0ZSkge1xuICAgICAgdGhpcy5ib2FyZCA9IHZhbGlkU3RhdGU7XG4gICAgICB0aGlzLmhpc3RvcnkgPSBbLi4udGhpcy5oaXN0b3J5LCBPYmplY3QuYXNzaWduKHt9LCB2YWxpZFN0YXRlW3hdW3ldKV07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGliZXJ0aWVzQXQoeCwgeSk6IG51bWJlciB7XG4gICAgY29uc3QgbSA9IHRoaXMuYXQoeCwgeSk7XG4gICAgcmV0dXJuIG0gPyB0aGlzLnJ1bGVTZXJ2aWNlLmxpYmVydGllcyh0aGlzLmJvYXJkLCBtKS5sZW5ndGggOiAwO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICAvLyBcbiAgICBjb25zb2xlLmxvZyh0aGlzLmJvYXJkLm1hcChsID0+IGwubWFwKHAgPT4gcC5zdGF0ZSA/IHAuc3RhdGUgOiAnJykpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb2FyZFNlcnZpY2U7IiwiZXhwb3J0ICogZnJvbSBcIi4vYm9hcmQuc2VydmljZVwiOyIsImV4cG9ydCBjb25zdCBBUFBOQU1FID0gXCJ0ZW5nZW4uanNcIjtcbmV4cG9ydCBjb25zdCBWRVIgPSBcIjAuMVwiO1xuXG5leHBvcnQgY29uc3QgRU1QVFk6IGFueSA9IG51bGw7XG5leHBvcnQgY29uc3QgQkxBQ0sgPSBcImJsYWNrXCI7XG5leHBvcnQgY29uc3QgV0hJVEUgPSBcIndoaXRlXCI7XG5leHBvcnQgY29uc3QgUEFTUyA9IFwicGFzc1wiO1xuZXhwb3J0IGNvbnN0IFVORE8gPSBcInVuZG9cIjtcbmV4cG9ydCBjb25zdCBBQkFORE9OID0gXCJhYmFuZG9uXCI7XG5leHBvcnQgY29uc3QgTkVYVCA9IFwibmV4dFwiO1xuZXhwb3J0IGNvbnN0IFBSRVYgPSBcInByZXZcIjtcbmV4cG9ydCBjb25zdCBFTkQgPSBcImVuZF9nYW1lXCI7XG5leHBvcnQgY29uc3QgU1RBUlQgPSBcInN0YXJ0X2dhbWVcIjtcblxuZXhwb3J0IGVudW0gU3RhdGUge1xuICBCTEFDSyA9ICdibGFjaycsXG4gIFdISVRFID0gJ3doaXRlJyxcbiAgS08gPSAna28nLFxufSBcbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSB7XG4gIHN0YXRlOiBTdGF0ZSB8IG51bGwsXG4gIHVwZGF0ZWRfYXQ/OiBEYXRlLFxuICBvcmRlcjogbnVtYmVyLCBcbiAgeDpudW1iZXJcbiAgeTpudW1iZXIsXG4gIGxvZz86IE1vdmVbXSxcbiAgY2FwdHVyZWQ/OiBbXVxufVxuXG4vKlxuZXhwb3J0IGNvbnN0IGFscGhhYmV0ID0gKHMgPSAyNikgPT4ge1xuICByZXR1cm4gbmV3IEFycmF5KHMpLmZpbGwoMSkubWFwKChfOmFueSwgaTpudW1iZXIpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBpKSk7XG59O1xuXG5leHBvcnQgY29uc3QgYTJuID0gKGEgOiBzdHJpbmcpID0+IHtcbiAgcmV0dXJuIGFscGhhYmV0KCkuaW5kZXhPZihhKTtcbn07XG5leHBvcnQgY29uc3QgbjJhID0gKG46IG51bWJlcikgPT4ge1xuICByZXR1cm4gYWxwaGFiZXQoKVtuXTtcbn07XG5cbmV4cG9ydCBjb25zdCB0b0Nvb3JkID0gKG5vZGU6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSkgPT4ge1xuICBjb25zdCB7IHgsIHkgfSA9IG5vZGU7XG4gIHJldHVybiBuMmEoeCkgKyBuMmEoeSk7XG59O1xuZXhwb3J0IGNvbnN0IGZyb21TR0ZDb29yZCA9IChzZ2Zub2RlOiBhbnkpID0+IHtcbiAgY29uc3QgbW92ZSA9IHNnZm5vZGUuQiB8fCBzZ2Zub2RlLlc7XG4gIGlmIChtb3ZlKSB7XG4gICAgY29uc3QgW3gsIHldID0gbW92ZS5zcGxpdChcIlwiKTtcbiAgICByZXR1cm4geyB4OiBhMm4oeCksIHk6IGEybih5KSB9O1xuICB9XG4gIHJldHVybiB7IHg6IG51bGwsIHk6IG51bGwgfTtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSXRlbSB7XG4gIGlkPzogYW55O1xuICBjcmVhdGVkQXQ/OiBEYXRlIHwgbnVsbDtcbiAgdXBkYXRlZEF0PzogRGF0ZSB8IG51bGw7XG4gIGRlbGV0ZWRBdD86IERhdGUgfCBudWxsO1xuICBhdXRob3I/OiBQbGF5ZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIENvbW1lbnQge1xuICBvcmRlcjogbnVtYmVyO1xuICB0ZXh0OiBzdHJpbmc7XG4gIHRpbWU/OiBEYXRlO1xuICBtb3ZlPzogYW55O1xufVxuZXhwb3J0IGludGVyZmFjZSBHYW1lU2V0dGluZ3MgZXh0ZW5kcyBJdGVtIHtcbiAgd2hpdGU6IFBsYXllcjtcbiAgYmxhY2s6IFBsYXllcjtcbiAgc2l6ZTogbnVtYmVyO1xuICBzY29yZXM6IFNjb3JlQm9hcmQ7XG4gIHRpdGxlPzogc3RyaW5nO1xuICBrb21pPzogbnVtYmVyO1xuICBjbG9jaz86IGFueTtcbiAgYm9hcmQ/OiBhbnk7XG4gIGV2ZW50Pzogc3RyaW5nO1xuICByb3VuZD86IG51bWJlcjtcbiAgZGF0ZT86IERhdGU7XG4gIGxvY2F0aW9uPzogc3RyaW5nO1xuICBjb21tZW50cz86IENvbW1lbnRbXTtcbiAgdHJlZT86IGFueVtdO1xuICBuZWVkQ29uZmlybTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHYW1lTGlzdEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHVwZGF0ZWRfYXQ6IGFueTtcbiAgdGltZXN0YW1wOiBudW1iZXI7XG4gIGtleTogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBsYXllciBleHRlbmRzIEl0ZW0ge1xuICBuYW1lOiBzdHJpbmc7XG4gIHJhbms/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2NvcmVCb2FyZCBleHRlbmRzIEl0ZW0ge1xuICBibGFjazogU2NvcmUgfCBudWxsO1xuICB3aGl0ZTogU2NvcmUgfCBudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjb3JlIGV4dGVuZHMgSXRlbSB7XG4gIGNhcHR1cmVkPzogbnVtYmVyO1xuICB0ZXJyaXRvcnk/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW92ZSBleHRlbmRzIEl0ZW0ge1xuICB4PzogbnVtYmVyO1xuICB5PzogbnVtYmVyO1xuICBwbGF5ZXI6IGFueTtcbiAgc3RhdGU6IGFueTtcbiAgbGVhZnM/OiBNb3ZlW107XG4gIG9yZGVyPzogbnVtYmVyO1xuICBpbkhpc3Rvcnk/OiBib29sZWFuO1xuICBjYXB0dXJlZD86IE1vdmVbXTtcbiAgcGxheWVkOiBib29sZWFuO1xuICBjb21tZW50cz86IGFueVtdO1xuICB0aW1lPzogbnVtYmVyO1xufVxuKi8iLCJpbXBvcnQgeyBNb3ZlLCBTdGF0ZSB9IGZyb20gXCIuL21vZGVsc1wiO1xuXG5jbGFzcyBSdWxlU2VydmljZSB7XG4gICAgdmFsaWRhdGUoZ2FtZSwgbXY6IE1vdmUpIHtcbiAgICAgICAgbGV0IG5leHRTdGF0ZSA9IFsuLi5nYW1lLnNsaWNlKCldO1xuICAgICAgICBjb25zdCBoYXNMaWJlcnRpZXMgPSBtID0+IHRoaXMubGliZXJ0aWVzKG5leHRTdGF0ZSwgbSkubGVuZ3RoO1xuICAgICAgICBjb25zdCBpc0NhcHR1cmluZyA9IG0gPT4ge1xuICAgICAgICAgICAgY29uc3QgbmV4dCA9IFsuLi5nYW1lLnNsaWNlKCldO1xuICAgICAgICAgICAgbmV4dFttdi54XVttdi55XSA9IG12O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FwdHVyZWQobmV4dCwgbSkubGVuZ3RoXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGlzS29Qcm90ZWN0ZWQgPSBtID0+IGdhbWVbbS54XVttLnldLnN0YXRlID09PSBTdGF0ZS5LT1xuICAgICAgICBjb25zdCBpc0ZyZWUgPSBtID0+ICFnYW1lW20ueF1bbS55XS5zdGF0ZTtcbiAgICAgICAgY29uc3QgdmFsaWQgPSBtID0+IGlzRnJlZShtKSAmJsKgKGlzQ2FwdHVyaW5nKG0pIHx8IGhhc0xpYmVydGllcyhtKSkgJiYgIWlzS29Qcm90ZWN0ZWQobSk7XG4gICAgICAgIGNvbnN0IGlzS29TaXR1YXRpb24gPSBtID0+IG0uY2FwdHVyZWQubGVuZ3RoID09PSAxICYmICF0aGlzLmxpYmVydGllcyhuZXh0U3RhdGUsIG0pLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmICh2YWxpZChtdikpIHtcbiAgICAgICAgICAgIG5leHRTdGF0ZSA9IHRoaXMucmVzZXRLbyhuZXh0U3RhdGUpO1xuICAgICAgICAgICAgbmV4dFN0YXRlW212LnhdW212LnldID0gbXY7XG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlZCA9IHRoaXMuY2FwdHVyZWQobmV4dFN0YXRlLCBtdikucmVkdWNlKChjLCBpKSA9PiBjLmNvbmNhdChpKSwgW10pO1xuICAgICAgICAgICAgbmV4dFN0YXRlW212LnhdW212LnldLmNhcHR1cmVkID0gY2FwdHVyZWQuc2xpY2UoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGlzS29TaXR1YXRpb24obXYpKSB7XG4gICAgICAgICAgICAgICAgbmV4dFN0YXRlW2NhcHR1cmVkWzBdLnhdW2NhcHR1cmVkWzBdLnldLnN0YXRlID0gU3RhdGUuS087XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBjYXB0dXJlZC5yZWR1Y2UoKHAsIGMpID0+IHtcbiAgICAgICAgICAgICAgICBwW2MueF1bYy55XS5zdGF0ZSA9IGMuc3RhdGUgPT09IFN0YXRlLktPIFxuICAgICAgICAgICAgICAgICAgICA/IFN0YXRlLktPIDogbnVsbDtcbiAgICAgICAgICAgICAgICByZXR1cm4gcDtcbiAgICAgICAgICAgIH0sIG5leHRTdGF0ZSk7XG4gICAgICAgIH0gXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHttdi54fToke212Lnl9IHdhcyBub3QgYSB2YWxpZCBtb3ZlICgke2dhbWVbbXYueF1bbXYueV0uc3RhdGV9KWApO1xuICAgIH1cbiAgICByZXNldEtvKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5tYXAobCA9PiBsLm1hcChwID0+IHtcbiAgICAgICAgICAgcC5zdGF0ZSA9IHAuc3RhdGUgPT0gU3RhdGUuS08gPyBudWxsIDogcC5zdGF0ZTsgXG4gICAgICAgICAgIHJldHVybiBwOyBcbiAgICAgICAgfSkpXG4gICAgICAgIFxuICAgIH1cbiAgICBhZGphY2VudChib2FyZCwgbW92ZSkge1xuICAgICAgICBjb25zdCBlbmQgPSBib2FyZC5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gMDtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIG1vdmUueSA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54XVttb3ZlLnkgLSAxXSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnkgPCBlbmQgPyBib2FyZFttb3ZlLnhdW21vdmUueSArIDFdIDogbnVsbCxcbiAgICAgICAgICAgIG1vdmUueCA+IHN0YXJ0ID8gYm9hcmRbbW92ZS54IC0gMV1bbW92ZS55XSA6IG51bGwsXG4gICAgICAgICAgICBtb3ZlLnggPCBlbmQgPyBib2FyZFttb3ZlLnggKyAxXVttb3ZlLnldIDogbnVsbFxuICAgICAgICBdLmZpbHRlcihpID0+IGkpO1xuICAgIH1cblxuICAgIGdyb3VwKGJvYXJkLCBwb2ludDogTW92ZSwgcXVldWU6IE1vdmVbXSA9IFtdLCB2aXNpdGVkID0gbmV3IFNldCgpKTogTW92ZVtdIHtcbiAgICAgICAgdmlzaXRlZC5hZGQoYCR7cG9pbnQueH06JHtwb2ludC55fWApO1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShcbiAgICAgICAgICAgIG5ldyBTZXQoW1xuICAgICAgICAgICAgICAgIHBvaW50LFxuICAgICAgICAgICAgICAgIC4uLnF1ZXVlLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMuYWRqYWNlbnQoYm9hcmQsIHBvaW50KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG4gPT4gIXZpc2l0ZWQuaGFzKGAke24ueH06JHtuLnl9YCkgJiYgbi5zdGF0ZSA9PT0gcG9pbnQuc3RhdGUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobiA9PiB0aGlzLmdyb3VwKGJvYXJkLCBuLCBxdWV1ZSwgdmlzaXRlZCkpXG4gICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGEsIHYpID0+IGEuY29uY2F0KHYpLCBbXSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgc2xpYmVydGllcyhib2FyZCwgbW92ZTogTW92ZSk6IE1vdmVbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkamFjZW50KGJvYXJkLCBtb3ZlKS5maWx0ZXIoaSA9PiAhaS5zdGF0ZSk7XG4gICAgfVxuXG4gICAgbGliZXJ0aWVzKGJvYXJkLCBtb3ZlOiBNb3ZlLCBjYXA/OiBNb3ZlKTogTW92ZVtdIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oXG4gICAgICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXAoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobSA9PiB0aGlzLnNsaWJlcnRpZXMoYm9hcmQsIG0pKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChhLCB2KSA9PiBhLmNvbmNhdCh2KSwgW10pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobCA9PiBsLnggIT09IG1vdmUueCB8fCBsLnkgIT09IG1vdmUueSlcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsID0+ICFjYXAgfHwgKGwueCAhPT0gY2FwLnggfHwgbC55ICE9PSBjYXAueSkpXG4gICAgICAgICAgICApXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgY2FwdHVyZWQoYm9hcmQsIG1vdmU6IE1vdmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRqYWNlbnQoYm9hcmQsIG1vdmUpXG4gICAgICAgICAgICAuZmlsdGVyKG0gPT4gbS5zdGF0ZSAmJiBtLnN0YXRlICE9PSBtb3ZlLnN0YXRlKVxuICAgICAgICAgICAgLmZpbHRlcihvID0+ICF0aGlzLmxpYmVydGllcyhib2FyZCwgbywgbW92ZSkubGVuZ3RoKVxuICAgICAgICAgICAgLm1hcChjID0+IHRoaXMuZ3JvdXAoYm9hcmQsIGMpKTtcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBSdWxlU2VydmljZTsiXSwic291cmNlUm9vdCI6IiJ9