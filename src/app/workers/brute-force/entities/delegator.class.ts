import SearchWorker from 'worker-loader!../search';

import { Subject, Observable } from 'rxjs';

import { Knight } from "../../../common/entities/knight.class";
import { Board } from "../../../common/entities/board.class";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";
import { NotificationsHandler } from "./notifications-handler.class";
import { INotificationMessage } from '../../../common/interfaces/messages/notifications/notification-message.interface';
import { Actions } from '../../../common/enums/actions.enum';
import { IStartSearchMessage } from '../../../common/interfaces/messages/actions/start-search-message.interface';
import { IBoard } from '../../../common/interfaces/board.interface';

export class Delegator {
    get notification(): Observable<INotificationMessage> {
        return this._notificationObservable;
    }

    constructor(knight: Knight) {
        if (!knight)
            throw new Error('Knight is not specified.');
        
        this._knight = knight;
        this._notificationsHandler = new NotificationsHandler();

        this._boards = [];
        this._searchWorkers = [];

        this._notificationSubject = new Subject<INotificationMessage>();
        this._notificationObservable = this._notificationSubject.asObservable();
    }

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

    start(maxThreadCount: number) {
        if (this._progress)
            return;

        this._progress = true;

        this._notificationsHandler.generalNotification
            .subscribe(message => this._notificationSubject.next(message));
        
        this._notificationsHandler.searchStopNotification
            .subscribe(message => this.searchStopHandler(message));
        
        this._boards = this.getBoardsToSolve(maxThreadCount);

        for (let i = 0;  i < maxThreadCount && i < this._boards.length; i++) {
            const searchWorker = new SearchWorker();
            searchWorker.addEventListener('message', ev => this._notificationsHandler.handle(ev.data));
            this._searchWorkers.push(searchWorker);
        }

        const boardsToStartFrom = this._boards.splice(0, this._searchWorkers.length);

        this._searchWorkers.forEach((worker, index) => {
            const startMessage = Delegator.generateStartSearchMessage(`${index + 1}`, boardsToStartFrom[index].asJSON());
            worker.postMessage(startMessage);
        });
    }

    private _progress: boolean;

    private _knight: Knight;

    private _boards: Board[];

    private _notificationsHandler: NotificationsHandler;

    private _searchWorkers: SearchWorker[];

    private _notificationSubject: Subject<INotificationMessage>;

    private _notificationObservable: Observable<INotificationMessage>;

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

    private searchStopHandler(message: ISearchStoppedMessage) {
        const boards = this._boards;
        const searchWorkers = this._searchWorkers;
        
        if (boards.length > 0) {
            const board = boards.pop();
            if (board) {
                const index = +message.tag - 1;
                const startMessage = Delegator.generateStartSearchMessage(`${index + 1}`, board.asJSON());
                searchWorkers[index].postMessage(startMessage);
            }
        }
    }
}
