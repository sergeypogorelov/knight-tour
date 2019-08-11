import { IBoard } from "../../../common/interfaces/board.interface";
import { INotifications } from "../interfaces/notifications.interface";
import { NotificationsWrapper } from "./notifications-wrapper.class";

export class NotificationsHandler {
    get notifications(): INotifications {
        return this._notifications;
    }

    constructor() {
        this._notificationsWrapper = new NotificationsWrapper();

        this._notifications = {
            searchStarts: this._notificationsWrapper.interface.searchStarts,
            searchProgressReportDone: this._notificationsWrapper.interface.searchProgressReportDone,
            searchResultFound: this._notificationsWrapper.interface.searchResultFound,
            searchStops: this._notificationsWrapper.interface.searchStops
        };
    }

    /**
     * notifies the search has been started
     * 
     * @param tag thread tag
     */
    notifySearchStarted(tag: string) {
        this._notificationsWrapper.notifySearchStarted(tag);
    }

    /**
     * notifies about search progress
     * 
     * @param tag thread tag
     * @param movesTaken count of taken moves during the search
     * @param movesUntaken count of untaken moves during the search
     */
    notifySearchProgress(tag: string, movesTaken: number, movesUntaken: number) {
        this._notificationsWrapper.notifySearchProgress(tag, movesTaken, movesUntaken);
    }

    /**
     * notifies about solution found
     * 
     * @param tag thread tag
     * @param board solution
     */
    notifySearchResult(tag: string, board: IBoard) {
        this._notificationsWrapper.notifySearchResult(tag, board);
    }

    /**
     * notifies the search has been stopped
     * 
     * @param tag thread tag
     */
    notifySearchStopped(tag: string) {
        this._notificationsWrapper.notifySearchStopped(tag);
    }

    private _notifications: INotifications;

    private _notificationsWrapper: NotificationsWrapper;
}
