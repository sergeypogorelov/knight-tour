import { Subject, Observable } from 'rxjs';

import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";
import { IBoard } from "../../../common/interfaces/board.interface";

import { ISearchStartedMessage } from '../../../common/interfaces/messages/notifications/search-started.interface';
import { ISearchStoppedMessage } from '../../../common/interfaces/messages/notifications/search-stopped.interface';
import { ISearchResultMessage } from '../../../common/interfaces/messages/notifications/search-result.interface';
import { ISearchProgressMessage } from '../../../common/interfaces/messages/notifications/search-progress.interface';

import { Notifications } from '../../../common/enums/notifications.enum';

import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";

const PROGRESS_DIVIDER = 1000;

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
        return this._searchStartSubject.asObservable();
    }

    /**
     * emits each time a solution has been found
     */
    get searchResultFound(): Observable<ISearchResultMessage> {
        return this._searchResultSubject.asObservable();
    }

    /**
     * emits each time a progress report is done
     */
    get searchProgressReportDone(): Observable<ISearchProgressMessage> {
        return this._searchProgressSubject.asObservable();
    }

    /**
     * emits each time before the search has been stopped
     */
    get searchStops(): Observable<ISearchStoppedMessage> {
        return this._searchStopSubject.asObservable();
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
        this._tag = tag;

        this._movesTaken = 0;
        this._movesUntaken = 0;

        this._foundSolutions = [];

        const lastMove = this.knight.findLastMove();
        const moveNumber = this.knight.board.cells[lastMove.row][lastMove.column];

        this.notifySearchStarted();
        this.searchKnightTour(lastMove, moveNumber);
        this.notifySearchStopped();

        return this._foundSolutions;
    }

    /**
     * thread tag
     */
    private _tag: string;

    /**
     * current knight
     */
    private _knight: Knight;

    /**
     * found solutions during the last search
     */
    private _foundSolutions: IBoard[];

    /**
     * count of taken moves
     */
    private _movesTaken: number;

    /**
     * count of untaken moves
     */
    private _movesUntaken: number;

    /**
     * subject for search starts observable
     */
    private _searchStartSubject = new Subject<ISearchStartedMessage>();

    /**
     * subject for search progress report done observable
     */
    private _searchProgressSubject = new Subject<ISearchProgressMessage>();

    /**
     * subject for search result found observable
     */
    private _searchResultSubject = new Subject<ISearchResultMessage>();

    /**
     * subject for search stop observable
     */
    private _searchStopSubject = new Subject<ISearchStoppedMessage>();

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
                this._movesTaken++;

                if (this._movesTaken % PROGRESS_DIVIDER === 0) {
                    this.notifySearchProgress();
                }

                const result = this.searchKnightTour(newMove, newMoveNumber);
                if (result) {
                    this.notifySearchResult(result);
                    this._foundSolutions.push(result);
                }

                this.knight.untakeMove(newMove);
                this._movesUntaken++;

                if (this._movesUntaken % PROGRESS_DIVIDER === 0) {
                    this.notifySearchProgress();
                }
            }
        }

        return null;
    }

    /**
     * notifies the search has been started
     */
    private notifySearchStarted() {
        const searchStartMessage: ISearchStartedMessage = {
            tag: this._tag,
            type: Notifications.SearchStarted
        };

        this._searchStartSubject.next(searchStartMessage);
    }

    /**
     * notifies about search progress
     */
    private notifySearchProgress() {
        const searchProgressMessage: ISearchProgressMessage = {
            tag: this._tag,
            type: Notifications.SearchProgress,
            movesTaken: this._movesTaken,
            movesUntaken: this._movesUntaken
        };

        this._searchProgressSubject.next(searchProgressMessage);
    }

    /**
     * notifies about solution found
     * 
     * @param board solution
     */
    private notifySearchResult(board: IBoard) {
        const searchResultMessage: ISearchResultMessage = {
            tag: this._tag,
            type: Notifications.SearchResult,
            board
        };

        this._searchResultSubject.next(searchResultMessage);
    }

    /**
     * notifies the search has been stopped
     */
    private notifySearchStopped() {
        const searchStopMessage: ISearchStoppedMessage = {
            tag: this._tag,
            type: Notifications.SearchStopped
        };

        this._searchStopSubject.next(searchStopMessage);
    }

}
