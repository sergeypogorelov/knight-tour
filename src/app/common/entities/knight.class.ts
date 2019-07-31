import { Board } from "./board.class";
import { IMatrixCoordinate } from "../interfaces/matrix-coordinate.interface";

/**
 * the chess knight
 */
export class Knight {

    /**
     * instance of the knight
     */
    static get instance(): Knight {
        if (!Knight._instance) {
            Knight._instance = new Knight();
        }

        return Knight._instance;
    }

    /**
     * the board on which the knight is
     */
    board: Board = null;

    /**
     * max count of moves in the knight's tour on the current board
     */
    get maxCountOfMoves(): number {
        if (!this.board)
            return 0;

        return this.board.countOfRows * this.board.countOfColumns;
    }

    /**
     * checks if the move is available to the knight
     * 
     * @param coordinate move coordinate
     */
    checkIfMoveAvailable(coordinate: IMatrixCoordinate): boolean {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        if (!this.board)
            throw new Error('Board is not specified.');

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

        if (!this.board)
            throw new Error('Board is not specified.');

        return this._availableMovesGenerators
            .map(moveGenerator => moveGenerator(currentCoordinate))
            .filter(possibleMoveCoordinate => possibleMoveCoordinate !== null);
    }
    
    /**
     * searchs for the last move on the board and returns its coordinate on success
     * returns NULL otherwise
     */
    findLastMove(): IMatrixCoordinate {
        if (!this.board)
            throw new Error('Board is not specified.');

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
     * sets starting position of the knight on the board
     * 
     * @param coordinate coordinate to set the starting position
     */
    setStartingPosition(coordinate: IMatrixCoordinate) {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        if (!this.board)
            throw new Error('Board is not specified.');

        this.board.cells[coordinate.row][coordinate.column] = Board.startingCellValue;
    }

    /**
     * Takes the specified move on the current board
     * 
     * @param coordinate move coordinate
     * @param moveNumber the move number
     */
    takeMove(coordinate: IMatrixCoordinate, moveNumber: number) {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        if (moveNumber <= Board.startingCellValue)
            throw new Error(`Move number should be greater than ${Board.startingCellValue}`);

        if (!this.board)
            throw new Error('Board is not specified.');

        if (!this.checkIfMoveAvailable(coordinate))
            throw new Error('Moving on the unavailable cell.');

        this.board.cells[coordinate.row][coordinate.column] = moveNumber;
    }

    /**
     * Untakes the specified move on the current board
     * 
     * @param coordinate move coordinate
     */
    untakeMove(coordinate: IMatrixCoordinate) {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        if (!this.board)
            throw new Error('Board is not specified.');

        this.board.cells[coordinate.row][coordinate.column] = Board.untouchedCellValue;
    }

    /**
     * instance of the knight
     */
    private static _instance: Knight;

    /**
     * moves generators of all possible moves of the knight
     */
    private _availableMovesGenerators: ((currentCoordinate: IMatrixCoordinate) => IMatrixCoordinate)[] = [
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
     * creates a knight
     */
    private constructor() {}

}
