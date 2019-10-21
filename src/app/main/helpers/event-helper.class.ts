import { Observable, Subject } from "rxjs";

const liveEvent = require('live-event');

/**
 * helper to work with live-event
 */
export class EventHelper {

    /**
     * attaches a live event
     * @param eventType event type for example 'click'
     * @param querySelector selector of items to listen to
     */
    static attachEvent(eventType: string, querySelector: string): Observable<Event> {
        const subject = new Subject<Event>();
        liveEvent(eventType, querySelector, (event: Event) => subject.next(event));
        return subject.asObservable();
    }

    private constructor() {}
}
