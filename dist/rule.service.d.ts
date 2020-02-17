import { Move } from "./models";
export default class RuleService {
    validate(game: any, mv: Move): any[];
    resetKo(state: any): any;
    adjacent(board: any, move: any): any[];
    group(board: any, point: Move, queue?: Move[], visited?: Set<unknown>): Move[];
    sliberties(board: any, move: Move): Move[];
    liberties(board: any, move: Move, cap?: Move): Move[];
    captured(board: any, move: Move): Move[][];
}
