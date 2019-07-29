import { Board } from "./board.class";
import { IMatrixCoordinate } from "../interfaces/matrix-coordinate.interface";

/**
 * a chess knight
 */
export class Knight {

    /**
     * the board on which the knight is
     */
    get board(): Board {
        return this._board;
    }

    /**
     * creates a knight on the specified chess board
     * 
     * @param board chess board
     */
    constructor(board: Board) {
        if (!board)
            throw new Error('Board is not specified.');
        
        this._board = board;
    }

    /**
     * checks if the move is available to the knight
     * 
     * @param coordinate 
     */
    checkIfMoveAvailable(coordinate: IMatrixCoordinate): boolean {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        return  coordinate.column > 0 &&
                coordinate.row > 0 &&
                coordinate.column < this.board.countOfColumns &&
                coordinate.row < this.board.countOfRows &&
                this.board.cells[coordinate.row][coordinate.column] === Board.untouchedCellValue;
    }

    /**
     * returns all available moves of the knight on the current board
     * 
     * @param currentCoordinate current coordinate of the knight
     */
    getAllAvailableMoves(currentCoordinate: IMatrixCoordinate): IMatrixCoordinate[] {
        if (!currentCoordinate)
            throw new Error('Current coordinate is not specified.');

        return this._availableMovesCheckers
            .map(checker => checker(currentCoordinate))
            .filter(possibleMoveCoordinate => possibleMoveCoordinate !== null);
    }

    /**
     * checkers of all possible moves of the knight
     */
    private _availableMovesCheckers: ((currentCoordinate: IMatrixCoordinate) => IMatrixCoordinate)[] = [
        /**
         * **
         * *
         * &
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column + 1;
            const row = currentCoordinate.row - 2;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         * ***
         * &
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column + 2;
            const row = currentCoordinate.row - 1;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         * &
         * ***
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column + 2;
            const row = currentCoordinate.row + 1;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         * &
         * *
         * **
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column + 1;
            const row = currentCoordinate.row + 2;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         *  &
         *  *
         * **
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column - 1;
            const row = currentCoordinate.row + 2;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         *   &
         * ***
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column - 2;
            const row = currentCoordinate.row + 1;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         * ***
         *   &
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column - 2;
            const row = currentCoordinate.row - 1;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        },
        /**
         * **
         *  *
         *  &
         */
        (currentCoordinate: IMatrixCoordinate) => {
            const column = currentCoordinate.column - 1;
            const row = currentCoordinate.row - 2;
            const coordinate = { column, row };
            return this.checkIfMoveAvailable(coordinate) ? coordinate : null;
        }
    ];

    /**
     * current chess board
     */
    private _board: Board;

}
