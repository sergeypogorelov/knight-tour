import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";
import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";
import { IBoard } from "../../../common/interfaces/board.interface";

/**
 * Knight's Tour search
 */
export class KnightTour {

    /**
     * current knight
     */
    get knight(): Knight {
        return this._knight;
    }

    /**
     * creates Knight's Tour search with specified board
     * 
     * @param board chess board
     */
    constructor(board: Board) {
        if (!board)
            throw new Error('Board is not specified.');

        this._knight = new Knight(board);
    }

    /**
     * searches for the Knight's Tour
     */
    search() {
        const lastMove = this.knight.findLastMove();
        const moveNumber = this.knight.board.cells[lastMove.row][lastMove.column];

        this._foundSolutions = [];
        this.searchKnightTour(lastMove, moveNumber);

    }

    private _knight: Knight;

    private _foundSolutions: IBoard[];

    /**
     * searches for the Knight's Tour based on the last move of the knight
     * 
     * @param lastMoveCoordinate move coordinate
     * @param lastMoveNumber move number
     */
    private searchKnightTour(lastMoveCoordinate: IMatrixCoordinate, lastMoveNumber: number): IBoard {
        const maxMovesCount = this.knight.maxCountOfMoves;

        if (lastMoveNumber === maxMovesCount - 1) {
            return this.knight.board.asJSON();
        } else {
            const availableMoves = this.knight.findAllAvailableMoves(lastMoveCoordinate);
            for (let i = 0; i < availableMoves.length; i++) {
                const newMove = availableMoves[i];
                const newMoveNumber = lastMoveNumber + 1;

                this.knight.takeMove(newMove, newMoveNumber);

                const result = this.searchKnightTour(newMove, newMoveNumber);
                if (result) {
                    this._foundSolutions.push(result);
                }

                this.knight.untakeMove(newMove);
            }
        }

        return null;
    }

}
