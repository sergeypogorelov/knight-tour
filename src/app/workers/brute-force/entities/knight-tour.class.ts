import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";
import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";

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

        const result = this.searchKnightTour(lastMove, moveNumber);
        console.log(result);
    }

    /**
     * current knight
     */
    private _knight: Knight;

    /**
     * searches for the Knight's Tour based on the last move of the knight
     * 
     * @param lastMoveCoordinate move coordinate
     * @param lastMoveNumber move number
     */
    private searchKnightTour(lastMoveCoordinate: IMatrixCoordinate, lastMoveNumber: number): Board {
        const maxMovesCount = this.knight.maxCountOfMoves;

        if (lastMoveNumber === maxMovesCount - 1) {
            return Board.createFromJSON(this.knight.board.asJSON());
        } else {
            let result: Board;

            const availableMoves = this.knight.findAllAvailableMoves(lastMoveCoordinate);
            for (let i = 0; i < availableMoves.length; i++) {
                const newMove = availableMoves[i];
                const newMoveNumber = lastMoveNumber + 1;

                this.knight.takeMove(newMove, newMoveNumber);

                result = this.searchKnightTour(newMove, newMoveNumber);

                if (result) {
                    return result;
                } else {
                    this.knight.untakeMove(newMove);
                }
            }
        }

        return null;
    }

}
