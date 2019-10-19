import SearchWorker from 'worker-loader!../search';

import { Subject, Observable, Subscription } from 'rxjs';

import { Actions } from '../../../common/enums/actions.enum';

import { IBoard } from '../../../common/interfaces/board.interface';
import { INotificationMessage } from '../../../common/interfaces/messages/notifications/notification-message.interface';
import { IStartSearchMessage } from '../../../common/interfaces/messages/actions/start-search-message.interface';
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";

import { Knight } from "../../../common/entities/knight.class";
import { Board } from "../../../common/entities/board.class";
import { NotificationsHandler } from "./notifications-handler.class";
import { SearchWorkersWrapperStop } from '../interfaces/search-workers-wrapper-stop.interface';

/**
 * wraper for search workers
 */
export class SearchWorkersWrapper {
    /**
     * indicates of the search is in progress
     */
    get progress(): boolean {
        return this._progress;
    }

    /**
     * emits each time when there is a notification from a child worker
     */
    get notification(): Observable<INotificationMessage> {
        return this._notificationObservable;
    }

    /**
     * emits each time the search stops
     */
    get searchStops(): Observable<any> {
        return this._searchStopsObservable;
    }

    /**
     * current knight
     */
    get knight(): Knight {
        return this._knight;
    }

    /**
     * creates an instance of search workers wrapper
     */
    constructor() {
        this._notificationsHandler = new NotificationsHandler();

        this._notificationSubject = new Subject<INotificationMessage>();
        this._notificationObservable = this._notificationSubject.asObservable();

        this._searchStopsSubject = new Subject<SearchWorkersWrapperStop>();
        this._searchStopsObservable = this._searchStopsSubject.asObservable();
    }

    /**
     * generates message saying to workers to start searching
     * @param tag worker tag
     * @param board board to solve
     */
    static generateStartSearchMessage(tag: string, board: IBoard): IStartSearchMessage {
        const type = Actions.SearchStart;
        const maxThreadCount: number = null;

        return {
            tag,
            type,
            board,
            maxThreadCount
        };
    }

    /**
     * sets the current knight
     */
    setKnight(knight: Knight) {
        if (!knight)
            throw new Error('Knight is not specified.');

        this._knight = knight;
    }

    /**
     * starts search for Knight's tour
     * @param maxThreadCount max count of threads to use in search
     */
    start(maxThreadCount: number) {
        if (!this._knight)
            throw new Error('Knight is not specified.');

        if (maxThreadCount < 1)
            throw new Error('Max count of threads cannot be less than one.');

        if (this._progress)
            return;

        this._progress = true;

        this.prepareSearch();

        this._subs.push(
            this._notificationsHandler.generalNotification
                .subscribe(message => this._notificationSubject.next(message))
        );
        
        this._subs.push(
            this._notificationsHandler.searchStopNotification
                .subscribe(message => this.searchStopHandler(message))
        );
        
        this._boards = this.getBoardsToSolve(maxThreadCount);

        for (let i = 0;  i < maxThreadCount && i < this._boards.length; i++) {
            const searchWorker = new SearchWorker();
            searchWorker.addEventListener('message', ev => this._notificationsHandler.handle(ev.data));
            this._searchWorkers.push(searchWorker);
        }

        const boardsToStartFrom = this._boards.splice(0, this._searchWorkers.length);

        this._searchWorkers.forEach((worker, index) => {
            const startMessage = SearchWorkersWrapper.generateStartSearchMessage(`${index + 1}`, boardsToStartFrom[index].asJSON());
            worker.postMessage(startMessage);
        });
    }

    /**
     * stops search
     */
    stop() {
        if (!this._knight)
            throw new Error('Knight is not specified.');

        if (!this._progress)
            return;

        this._progress = false;

        this._subs.forEach(i => i.unsubscribe());
        this._searchWorkers.forEach(i => i.terminate());

        this._searchStopsSubject.next({ countOfMoves: this._countOfMoves });
    }

    /**
     * indicates if the search is in progress
     */
    private _progress: boolean;

    /**
     * count of moves by all threads
     */
    private _countOfMoves: number;

    /**
     * current knight
     */
    private _knight: Knight;

    /**
     * list of boards left to solve
     */
    private _boards: Board[];

    /**
     * subscriptions
     */
    private _subs: Subscription[];

    /**
     * handler of workers notifications
     */
    private _notificationsHandler: NotificationsHandler;

    /**
     * search workers used while searching for Knight's Tour
     */
    private _searchWorkers: SearchWorker[];

    /**
     * subject for notification property
     */
    private _notificationSubject: Subject<INotificationMessage>;

    /**
     * observable for notification property
     */
    private _notificationObservable: Observable<INotificationMessage>;

    /**
     * subject for search stops
     */
    private _searchStopsSubject: Subject<SearchWorkersWrapperStop>;

    /**
     * observable for search stops
     */
    private _searchStopsObservable: Observable<SearchWorkersWrapperStop>;

    /**
     * generates boards to solve
     * @param minCount min count of boards to generate
     */
    private getBoardsToSolve(minCount: number): Board[] {
        let boards: Board[] = [];

        let depth = 0;
        let maxBoardsFound = 0;

        do {
            depth++;

            boards = this._knight.findAllMovesCombinations(depth);

            if (boards.length === maxBoardsFound)
                break;
            
            if (boards.length > maxBoardsFound) {
                maxBoardsFound = boards.length;
            }
        } while(boards.length < minCount);

        return boards;
    }

    /**
     * handler of search stop message from the workers
     * @param message 
     */
    private searchStopHandler(message: ISearchStoppedMessage) {
        const boards = this._boards;
        const searchWorkers = this._searchWorkers;
        
        this._countOfMoves += message.countOfMoves;

        if (boards.length > 0) {
            const board = boards.pop();
            if (board) {
                const index = +message.tag - 1;
                const startMessage = SearchWorkersWrapper.generateStartSearchMessage(`${index + 1}`, board.asJSON());
                searchWorkers[index].postMessage(startMessage);
            }
        }

        if (boards.length === 0) {
            this.stop();
        }
    }

    /**
     * prepares the search
     */
    private prepareSearch() {
        this._countOfMoves = 0;

        this._subs = [];

        this._boards = [];
        this._searchWorkers = [];
    }
}
