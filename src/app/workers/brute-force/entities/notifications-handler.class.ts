import { Subject, Observable } from "rxjs";
import { merge, throttleTime } from 'rxjs/operators';

import { INotificationMessage } from "../../../common/interfaces/messages/notifications/notification-message.interface";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";
import { ISearchProgressMessage } from "../../../common/interfaces/messages/notifications/search-progress.interface";

import { Notifications } from "../../../common/enums/notifications.enum";

const DELAY = 5;

export class NotificationsHandler {
    get generalNotification(): Observable<INotificationMessage> {
        return this._generalObservable;
    }

    get searchStopNotification(): Observable<ISearchStoppedMessage> {
        return this._searchStopObservable;
    }

    constructor() {
        this._searchStopObservable = this._searchStopSubject.asObservable();

        this._generalObservable = this._generalSubject
            .pipe(merge(this._searchStopObservable))
            .pipe(merge(this._progressSubject.pipe(throttleTime(DELAY))));
    }

    handle(message: INotificationMessage) {
        if (message.type === Notifications.SearchProgress) {
            this._progressSubject.next(message as ISearchProgressMessage);
        } else if (message.type === Notifications.SearchStopped) {
            this._searchStopSubject.next(message as ISearchStoppedMessage);
        } else {
            this._generalSubject.next(message);
        }
    }

    private _generalObservable: Observable<INotificationMessage>;

    private _searchStopObservable: Observable<ISearchStoppedMessage>;

    private _generalSubject = new Subject<INotificationMessage>();

    private _progressSubject = new Subject<ISearchProgressMessage>();

    private _searchStopSubject = new Subject<ISearchStoppedMessage>();
}
