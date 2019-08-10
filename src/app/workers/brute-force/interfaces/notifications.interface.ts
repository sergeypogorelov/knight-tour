import { Observable } from "rxjs";

import { ISearchStartedMessage } from "../../../common/interfaces/messages/notifications/search-started.interface";
import { ISearchResultMessage } from "../../../common/interfaces/messages/notifications/search-result.interface";
import { ISearchProgressMessage } from "../../../common/interfaces/messages/notifications/search-progress.interface";
import { ISearchStoppedMessage } from "../../../common/interfaces/messages/notifications/search-stopped.interface";

export interface INotifications {
    /**
     * emits each time the search has been started
     */
    readonly searchStarts: Observable<ISearchStartedMessage>;

    /**
     * emits each time a solution has been found
     */
    readonly searchResultFound: Observable<ISearchResultMessage>

    /**
     * emits each time a progress report is done
     */
    readonly searchProgressReportDone: Observable<ISearchProgressMessage>;

    /**
     * emits each time before the search has been stopped
     */
    readonly searchStops: Observable<ISearchStoppedMessage>;
}
