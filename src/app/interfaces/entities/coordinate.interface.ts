import { ChessBoardLetters } from "../../enums/chess-board-letters.enum";

/**
 * chess board cell coordinate
 */
export interface ICoordinate {
    /**
     * cell letter
     */
    letter: ChessBoardLetters;

    /**
     * cell number
     */
    number: number;
}
