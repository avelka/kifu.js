import { Move, State } from "./models";

class RuleService {
    validate(game, m: Move) {
        const nextState = [...game.slice()];
       

        const hasLiberties = m => this.groupLiberties(nextState, m).length;
        const isCapturing = m => this.captured(nextState, m).length;
        const isKo = m => game[m.x][m.y].state === State.KO
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

    liberties(board, move: Move): Move[] {
        return this.adjacent(board, move).filter(i => !i.state);
    }

    groupLiberties(board, move: Move, cap = null): Move[] {
        return Array.from(
            new Set(
                this.group(board, move)
                    .map(m => this.liberties(board, m))
                    .reduce((a, v) => a.concat(v), [])
                    .filter(l => l.x !== move.x || l.y !== move.y)
                    .filter(l => !cap || (l.x !== cap.x || l.y !== cap.y))
            )
        );
    }

    captured(board, move: Move) {
        return this.adjacent(board, move)
            .filter(m => m.state && m.state !== move.state)
            .filter(o => !this.groupLiberties(board, o, move).length)
            .map(c => this.group(board, c));
    }
}
export default RuleService;