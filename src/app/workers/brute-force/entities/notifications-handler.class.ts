import { Subject, Observable } from "rxjs";
import { merge, throttleTime } from 'rxjs/operators';

import { Notifications } from "../../../common/enums/notifications.enum";

import { INotificationMessage } from "../../../common/interfaces/messages/notifications/notification-message.interface";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";
import { ISearchProgressMessage } from "../../../common/interfaces/messages/notifications/search-progress.interface";

/**
 * delay for search progress notifications
 */
const DELAY = 5;

export class NotificationsHandler {
    /**
     * emits all notification during the search
     */
    get generalNotification(): Observable<INotificationMessage> {
        return this._generalObservable;
    }

    /**
     * emits only search stop notifications
     */
    get searchStopNotification(): Observable<ISearchStoppedMessage> {
        return this._searchStopObservable;
    }

    /**
     * creates an instance of a notifications handler
     */
    constructor() {
        this._searchStopObservable = this._searchStopSubject.asObservable();

        this._generalObservable = this._generalSubject
            .pipe(merge(this._searchStopObservable))
            .pipe(merge(this._progressSubject.pipe(throttleTime(DELAY))));
    }

    /**
     * handles the notification from a worker and emits it properly
     * @param message notification message
     */
    handle(message: INotificationMessage) {
        if (message.type === Notifications.SearchProgress) {
            this._progressSubject.next(message as ISearchProgressMessage);
        } else if (message.type === Notifications.SearchStopped) {
            this._searchStopSubject.next(message as ISearchStoppedMessage);
        } else {
            this._generalSubject.next(message);
        }
    }

    /**
     * observable for general notification
     */
    private _generalObservable: Observable<INotificationMessage>;

    /**
     * observable for search stop notification
     */
    private _searchStopObservable: Observable<ISearchStoppedMessage>;

    /**
     * subject for all notifications
     */
    private _generalSubject = new Subject<INotificationMessage>();

    /**
     * subject for search progress notification
     */
    private _progressSubject = new Subject<ISearchProgressMessage>();

    /**
     * subject for search stop notification
     */
    private _searchStopSubject = new Subject<ISearchStoppedMessage>();
}
