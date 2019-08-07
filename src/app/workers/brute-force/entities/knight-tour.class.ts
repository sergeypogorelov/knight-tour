import { Subject, Observable } from 'rxjs';

import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";
import { IBoard } from "../../../common/interfaces/board.interface";

import { ISearchStartedMessage } from '../../../common/interfaces/messages/notifications/search-started.interface';
import { ISearchStoppedMessage } from '../../../common/interfaces/messages/notifications/search-stopped.interface';

import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";
import { Notifications } from '../../../common/enums/notifications.enum';

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
     * emits each time the search has been started
     */
    get searchStarts(): Observable<ISearchStartedMessage> {
        return this._searchStartsSubject.asObservable();
    }

    /**
     * emits each time before the search has been stopped
     */
    get searchStops(): Observable<ISearchStoppedMessage> {
        return this._searchStopsSubject.asObservable();
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
    search(tag: string): IBoard[] {
        const lastMove = this.knight.findLastMove();
        const moveNumber = this.knight.board.cells[lastMove.row][lastMove.column];

        this._foundSolutions = [];

        const searchStartMessage: ISearchStartedMessage = {
            tag: tag,
            type: Notifications.SearchStarted
        };
        this._searchStartsSubject.next(searchStartMessage);

        this.searchKnightTour(lastMove, moveNumber);

        const searchStopMessage: ISearchStoppedMessage = {
            tag: tag,
            type: Notifications.SearchStopped
        };
        this._searchStopsSubject.next(searchStopMessage);

        return this._foundSolutions;
    }

    /**
     * current knight
     */
    private _knight: Knight;

    /**
     * found solutions during the last search
     */
    private _foundSolutions: IBoard[];

    private _searchStartsSubject = new Subject<ISearchStartedMessage>();

    private _searchStopsSubject = new Subject<ISearchStoppedMessage>();

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
