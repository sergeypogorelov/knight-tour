import { Board } from "./board.class";
import { IMatrixCoordinate } from "../interfaces/matrix-coordinate.interface";
import { IBoardCoordinate } from "../interfaces/board-coordinate.interface";

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

        return  coordinate.column >= 0 &&
                coordinate.row >= 0 &&
                coordinate.column < this.board.countOfColumns &&
                coordinate.row < this.board.countOfRows &&
                this.board.cells[coordinate.row][coordinate.column] === Board.untouchedCellValue;
    }

    /**
     * returns all available moves of the knight on the current board
     * 
     * @param currentCoordinate current coordinate of the knight
     */
    findAllAvailableMoves(currentCoordinate: IMatrixCoordinate): IMatrixCoordinate[] {
        if (!currentCoordinate)
            throw new Error('Current coordinate is not specified.');

        return this._availableMovesCheckers
            .map(checker => checker(currentCoordinate))
            .filter(possibleMoveCoordinate => possibleMoveCoordinate !== null);
    }
    
    /**
     * searchs for the last move on the board and returns its coordinate on success
     * returns NULL otherwise
     */
    findLastMove(): IMatrixCoordinate {
        let result: IMatrixCoordinate = null;

        let row = -1;
        let column = -1;
        let cellValue = Board.untouchedCellValue;

        for (let i = 0; i < this.board.countOfRows; i++) {
            for (let j = 0; j < this.board.countOfColumns; j++) {

                let currentCellValue = this.board.cells[i][j];
                if (currentCellValue > cellValue) {
                    row = i;
                    column = j;
                    cellValue = currentCellValue;
                }
            }
        }

        if (cellValue !== Board.untouchedCellValue && row !== -1 && column !== -1) {
            result = { row, column };
        }

        return result;
    }

    /**
     * sets starting position
     * 
     * @param coordinate coordinate to set starting position
     */
    setStartingPosition(coordinate: IBoardCoordinate) {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        const matrixCoordinate = this.board.castCoordinateFromBoardToMatrix(coordinate);
        this.board.cells[matrixCoordinate.row][matrixCoordinate.column] = Board.startingCellValue;
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
