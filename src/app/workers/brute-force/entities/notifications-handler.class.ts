import { Subject, Observable } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

import { IBoard } from "../../../common/interfaces/board.interface";
import { INotificationMessage } from '../../../common/interfaces/messages/notifications/notification-message.interface';
import { ISearchStartedMessage } from '../../../common/interfaces/messages/notifications/search-started.interface';
import { ISearchProgressMessage } from '../../../common/interfaces/messages/notifications/search-progress.interface';
import { ISearchResultMessage } from '../../../common/interfaces/messages/notifications/search-result.interface';
import { ISearchStoppedMessage } from '../../../common/interfaces/messages/notifications/search-stopped.interface';

import { NotificationsWrapper } from "./notifications-wrapper.class";
import { Notifications } from '../../../common/enums/notifications.enum';

const GENERAL_DELAY = 5;
const REPORT_DELAY = 20;

export class NotificationsHandler {
    get notification(): Observable<INotificationMessage> {
        return this._notificationObservable;
    }

    constructor() {
        this._notificationsWrapper = new NotificationsWrapper();
        this._generalSubject = new Subject<INotificationMessage>();

        this._notificationsWrapper.interface.searchStarts
            .subscribe(messsage => this._generalSubject.next(messsage));

        this._notificationsWrapper.interface.searchProgressReportDone
            .pipe(debounceTime(REPORT_DELAY))
            .subscribe(message => this._generalSubject.next(message));
        
        this._notificationsWrapper.interface.searchResultFound
            .subscribe(message => this._generalSubject.next(message));

        this._notificationsWrapper.interface.searchStops
            .subscribe(message => this._generalSubject.next(message));
        
        this._notificationObservable = this._generalSubject.pipe(delay(GENERAL_DELAY));
    }

    handle(message: INotificationMessage) {
        switch(message.type) {
            case Notifications.SearchStarted:
                const startMessage = message as ISearchStartedMessage;
                this.notifySearchStarted(startMessage.tag);
                break;
            case Notifications.SearchProgress:
                const progressMessage = message as ISearchProgressMessage;
                this.notifySearchProgress(progressMessage.tag, progressMessage.movesTaken, progressMessage.movesUntaken);
                break;
            case Notifications.SearchResult:
                const resultMessage = message as ISearchResultMessage;
                this.notifySearchResult(resultMessage.tag, resultMessage.board);
                break;
            case Notifications.SearchStopped:
                const stopMessage = message as ISearchStoppedMessage;
                this.notifySearchStopped(stopMessage.tag);
                break;
        }
    }

    private _notificationsWrapper: NotificationsWrapper;

    private _generalSubject: Subject<INotificationMessage>;

    private _notificationObservable: Observable<INotificationMessage>;

    /**
     * notifies the search has been started
     * 
     * @param tag thread tag
     */
    private notifySearchStarted(tag: string) {
        this._notificationsWrapper.notifySearchStarted(tag);
    }

    /**
     * notifies about search progress
     * 
     * @param tag thread tag
     * @param movesTaken count of taken moves during the search
     * @param movesUntaken count of untaken moves during the search
     */
    private notifySearchProgress(tag: string, movesTaken: number, movesUntaken: number) {
        this._notificationsWrapper.notifySearchProgress(tag, movesTaken, movesUntaken);
    }

    /**
     * notifies about solution found
     * 
     * @param tag thread tag
     * @param board solution
     */
    private notifySearchResult(tag: string, board: IBoard) {
        this._notificationsWrapper.notifySearchResult(tag, board);
    }

    /**
     * notifies the search has been stopped
     * 
     * @param tag thread tag
     */
    private notifySearchStopped(tag: string) {
        this._notificationsWrapper.notifySearchStopped(tag);
    }
}
