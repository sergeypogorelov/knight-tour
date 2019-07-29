import { Board } from "../../../common/entities/board.class";

export class KnightTour {

    constructor(board: Board) {
        if (!board)
            throw new Error('Board is not specified.');

        this._board = board;
    }

    

    private _board: Board;

}
