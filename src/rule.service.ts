import { Move, State } from "./models";

export default class RuleService {
    validate(game, mv: Move) {
        let nextState = [...game.slice()];
        const hasLiberties = m => this.liberties(nextState, m).length;
        const isCapturing = m => {
            const next = [...game.slice()];
            next[mv.x][mv.y] = mv;
            return this.captured(next, m).length
        };
        const isKoProtected = m => game[m.x][m.y].state === State.KO
        const isFree = m => !game[m.x][m.y].state;
        const valid = m => isFree(m) && (isCapturing(m) || hasLiberties(m)) && !isKoProtected(m);
        const isKoSituation = m => m.captured.length === 1 && !this.liberties(nextState, m).length;

        if (valid(mv)) {
            nextState = this.resetKo(nextState);
            nextState[mv.x][mv.y] = mv;
            const captured = this.captured(nextState, mv).reduce((c, i) => c.concat(i), []);
            nextState[mv.x][mv.y].captured = captured.slice();

            if (isKoSituation(mv)) {
                nextState[captured[0].x][captured[0].y].state = State.KO;
            }

            return captured.reduce((p, c) => {
                p[c.x][c.y].state = c.state === State.KO
                    ? State.KO : null;
                return p;
            }, nextState);
        }
        throw new Error(`${mv.x}:${mv.y} was not a valid move (${game[mv.x][mv.y].state})`);
    }

    resetKo(state) {
        return state.map(l => l.map(p => {
            p.state = p.state == State.KO ? null : p.state;
            return p;
        }))

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

    group(board, point: Move, queue: Move[] = [], visited = new Set()): Move[] {
        visited.add(`${point.x}:${point.y}`);
        return Array.from(
            new Set([
                point,
                ...queue,
                ...this.adjacent(board, point)
                    .filter(n => !visited.has(`${n.x}:${n.y}`) && n.state === point.state)
                    .map(n => this.group(board, n, queue, visited))
                    .reduce((a, v) => a.concat(v), [])
            ])
        );
    }

    sliberties(board, move: Move): Move[] {
        return this.adjacent(board, move).filter(i => !i.state);
    }

    liberties(board, move: Move, cap?: Move): Move[] {
        return Array.from(
            new Set(
                this.group(board, move)
                    .map(m => this.sliberties(board, m))
                    .reduce((a, v) => a.concat(v), [])
                    .filter(l => l.x !== move.x || l.y !== move.y)
                    .filter(l => !cap || (l.x !== cap.x || l.y !== cap.y))
            )
        );
    }

    captured(board, move: Move) {
        return this.adjacent(board, move)
            .filter(m => m.state && m.state !== move.state)
            .filter(o => !this.liberties(board, o, move).length)
            .map(c => this.group(board, c));
    }
}
