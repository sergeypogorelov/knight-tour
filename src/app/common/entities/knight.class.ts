import { Board } from "./board.class";
import { IMatrixCoordinate } from "../interfaces/matrix-coordinate.interface";

/**
 * the chess knight
 */
export class Knight {

    /**
     * the board on which the knight is
     */
    get board(): Board {
        return this._board;
    }

    /**
     * max count of moves in the knight's tour on the current board
     */
    get maxCountOfMoves(): number {
        if (!this.board)
            return 0;

        return this.board.countOfRows * this.board.countOfColumns;
    }

    /**
     * creates a knight on the specified board
     * 
     * @param board board on which the knight is
     */
    constructor(board: Board) {
        this.setBoard(board);
    }

    /**
     * creates a knight on the specified board
     * 
     * @param board board on which the knight is
     */
    static create(board: Board): Knight {
        if (!board)
            throw new Error('Board is not specified.');

        return new Knight(board);
    }

    /**
     * sets the specified board for the knight
     * 
     * @param board a chess board
     */
    setBoard(board: Board) {
        if (!board)
            throw new Error('Board is not specified.');

        this._board = board;
    }

    /**
     * checks if the move is available to the knight
     * 
     * @param coordinate move coordinate
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
    findAllAvailableMoves(currentCoordinate: IMatrixCoordinate = null): IMatrixCoordinate[] {
        if (!currentCoordinate) {
            currentCoordinate = this.findLastMove();
        }

        return this._availableMovesGenerators
            .map(moveGenerator => moveGenerator(currentCoordinate))
            .filter(possibleMoveCoordinate => possibleMoveCoordinate !== null);
    }

    /**
     * finds and returns all possible move combinations with specified parameters
     * 
     * @param depth depth of the search
     * @param moveCoordinate coordinate to start search from
     * @param moveNumber move number on the specified coordinate
     */
    findAllMovesCombinations(depth: number, moveCoordinate: IMatrixCoordinate = null, moveNumber: number = null): Board[] {
        if (depth < 1)
            throw new Error('Depth cannot be less than 1.');

        if (moveCoordinate === null) {
            moveCoordinate = this.findLastMove();

            if (moveCoordinate === null)
                throw new Error('Cannot determine the coordinate to start search from.');
        }

        if (moveNumber === null) {
            moveNumber = this.board.cells[moveCoordinate.row][moveCoordinate.column];
        }

        this._movesCombinations = [];

        const newBoard = Board.createFromJSON(this.board.asJSON());
        this.findAllMovesCombinationsRecursively(newBoard, moveCoordinate, moveNumber, depth);

        return this._movesCombinations;
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

        this.board.cells[coordinate.row][coordinate.column] = Board.untouchedCellValue;
    }

    /**
     * the board on which the knight is
     */
    private _board: Board = null;

    /**
     * moves combinations used by some private methods
     */
    private _movesCombinations: Board[] = null;

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
     * searchs for all possible moves combinations recursively
     * 
     * @param board current board
     * @param moveCoordinate current move coordinate
     * @param moveNumber current move number
     * @param depth depth counter
     */
    private findAllMovesCombinationsRecursively(board: Board, moveCoordinate: IMatrixCoordinate, moveNumber: number, depth: number) {
        if (depth === 0)
            return;
        
        const knight = Knight.create(board);

        const availableMoves = knight.findAllAvailableMoves(moveCoordinate);
        for (let i = 0; i < availableMoves.length; i++) {
            const availableMove = availableMoves[i];

            knight.takeMove(availableMove, moveNumber + 1);

            const newBoard = Board.createFromJSON(knight.board.asJSON());

            if (depth === 1) {
                this._movesCombinations.push(newBoard);
            } else {
                this.findAllMovesCombinationsRecursively(newBoard, availableMove, moveNumber + 1, depth - 1);
            }

            knight.untakeMove(availableMove);
        }
    }

}
