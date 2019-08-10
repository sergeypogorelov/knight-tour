import { Subject } from "rxjs";

import { INotifications } from "../interfaces/notifications.interface";
import { ISearchStartedMessage } from "../../../common/interfaces/messages/notifications/search-started.interface";
import { ISearchProgressMessage } from "../../../common/interfaces/messages/notifications/search-progress.interface";
import { ISearchResultMessage } from "../../../common/interfaces/messages/notifications/search-result.interface";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";
import { IBoard } from "../../../common/interfaces/board.interface";

import { Notifications } from "../../../common/enums/notifications.enum";

export class NotificationsWrapper {
    /**
     * interface of notifications
     */
    get interface(): INotifications {
        return this._interface;
    }

    /**
     * creates instance of a notifications wrapper
     */
    constructor() {
        this._searchStartSubject = new Subject<ISearchStartedMessage>();
        this._searchProgressSubject = new Subject<ISearchProgressMessage>();
        this._searchResultSubject = new Subject<ISearchResultMessage>();
        this._searchStopSubject = new Subject<ISearchStoppedMessage>();

        this._interface = {
            searchStarts: this._searchStartSubject.asObservable(),
            searchProgressReportDone: this._searchProgressSubject.asObservable(),
            searchResultFound: this._searchResultSubject.asObservable(),
            searchStops: this._searchStopSubject.asObservable()
        };
    }

    /**
     * notifies the search has been started
     * 
     * @param tag thread tag
     */
    notifySearchStarted(tag: string) {
        const searchStartMessage: ISearchStartedMessage = {
            tag,
            type: Notifications.SearchStarted
        };

        this._searchStartSubject.next(searchStartMessage);
    }

    /**
     * notifies about search progress
     * 
     * @param tag thread tag
     * @param movesTaken count of taken moves during the search
     * @param movesUntaken count of untaken moves during the search
     */
    notifySearchProgress(tag: string, movesTaken: number, movesUntaken: number) {
        const searchProgressMessage: ISearchProgressMessage = {
            type: Notifications.SearchProgress,
            tag,
            movesTaken,
            movesUntaken
        };

        this._searchProgressSubject.next(searchProgressMessage);
    }

    /**
     * notifies about solution found
     * 
     * @param tag thread tag
     * @param board solution
     */
    notifySearchResult(tag: string, board: IBoard) {
        const searchResultMessage: ISearchResultMessage = {
            type: Notifications.SearchResult,
            tag,
            board
        };

        this._searchResultSubject.next(searchResultMessage);
    }

    /**
     * notifies the search has been stopped
     * 
     * @param tag thread tag
     */
    notifySearchStopped(tag: string) {
        const searchStopMessage: ISearchStoppedMessage = {
            tag,
            type: Notifications.SearchStopped
        };

        this._searchStopSubject.next(searchStopMessage);
    }

    /**
     * interface of notifications
     */
    private _interface: INotifications;

    /**
     * subject for search starts observable
     */
    private _searchStartSubject: Subject<ISearchStartedMessage>;

    /**
     * subject for search progress report done observable
     */
    private _searchProgressSubject: Subject<ISearchProgressMessage>;

    /**
     * subject for search result found observable
     */
    private _searchResultSubject: Subject<ISearchResultMessage>;

    /**
     * subject for search stop observable
     */
    private _searchStopSubject: Subject<ISearchStoppedMessage>;
}
