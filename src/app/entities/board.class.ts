import { IBoard } from "../interfaces/board.interface";
import { IBoardCoordinate } from "../interfaces/board-coordinate.interface";
import { IMatrixCoordinate } from "../interfaces/matrix-coordinate.interface";
import { BoardLetters } from "../enums/board-letters.enum";

/**
 * a chess board
 */
export class Board implements IBoard {
    /**
     * cell value if the knight hasn't moved yet
     */
    static readonly untouchedCellValue = -1;

    /**
     * cell value of the starting position
     */
    static readonly startingCellValue = 0;

    /**
     * creates and returns a board with specified cells
     * 
     * @param cells cells for a chess board
     */
    static createFromCells(cells: Array<Array<number>>): Board {
        if (!cells)
            throw new Error('Cells are not specified.');

        const result = new Board();
        result._cells = Board.cloneCells(cells);
        return result;
    }

    /**
     * creates and returns a board based on JSON
     * 
     * @param board a chess board as JSON
     */
    static createFromJSON(board: IBoard): Board {
        if (!board)
            throw new Error('Board is not speicifed.');

        const result = new Board();
        result._cells = Board.cloneCells(board.cells);
        return result;
    }

    /**
     * generates and returns untouched cells
     * 
     * @param width home many letters on the board (ex. A, B, C)
     * @param height how many numbers on the board (ex. 1, 2, 3)
     */
    static generateUntouchedCells(width = 3, height = 3): Array<Array<number>> {
        if (width < 3)
            throw new Error('The board width cannot be less than 3.');
        
        if (height < 3)
            throw new Error('The board height cannot be less than 3.');

        const result = [];

        for (let i = 0; i < height; i++) {

            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(Board.untouchedCellValue);
            }

            result.push(row);
        }

        return result;
    }

    /**
     * clones cells and returns them
     * 
     * @param cells cells to clone
     */
    static cloneCells(cells: Array<Array<number>>): Array<Array<number>> {
        if (!cells)
            throw new Error('Cells are not specified.');

        const result: Array<Array<number>> = [];

        cells.forEach(row => {
            result.push(row.slice());
        });

        return result;
    }

    /**
     * chess board cells
     * number says the move number in the knight tour
     */
    get cells(): Array<Array<number>> {
        return this._cells;
    }

    /**
     * creates an empty chess board
     */
    constructor() {
        this._cells = [];
    }

    setStartingPosition(coordinate: IBoardCoordinate) {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        const matrixCoordinate = this.parseCoordinateFromBoardToMatrix(coordinate);
        this.cells[matrixCoordinate.column][matrixCoordinate.row] = Board.startingCellValue;
    }

    parseCoordinateFromMatrixToBoard(coordinate: IMatrixCoordinate): IBoardCoordinate {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');
        
        return {
            letter: coordinate.row + 1,
            number: coordinate.column - this.cells.length
        };
    }

    parseCoordinateFromBoardToMatrix(coordinate: IBoardCoordinate): IMatrixCoordinate {
        if (!coordinate)
            throw new Error('Coordinate is not specified.');

        return {
            row: coordinate.letter - 1,
            column: this.cells.length - coordinate.number
        };
    }

    /**
     * casts to a plain object and returns it
     */
    asJSON(): IBoard {
        return {
            cells: Board.cloneCells(this.cells)
        };
    }

    /**
     * chess board cells
     */
    private _cells: Array<Array<number>>;
}
