import { Observable } from "rxjs";
import { merge } from "rxjs/operators";

import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { ISearchErrorMessage } from "../../common/interfaces/messages/notifications/search-error.interface";

import { Actions } from "../../common/enums/actions.enum";
import { Notifications } from "../../common/enums/notifications.enum";

import { INotificationMessage } from "../../common/interfaces/messages/notifications/notification-message.interface";
import { Board } from "../../common/entities/board.class";
import { KnightTour } from "./entities/knight-tour.class";

const ctx: Worker = self as any;

let tag: string;

ctx.addEventListener("message", (message) => {
  const messageData = message.data as IActionMessage;

  tag = messageData.tag;

  if (messageData.type === Actions.SearchStart) {
    const actionMessage = messageData as IStartSearchMessage;
    const knightTour = new KnightTour(
      Board.createFromJSON(actionMessage.board)
    );

    const {
      searchStarts,
      searchProgressReportDone,
      searchResultFound,
      searchStops,
    } = knightTour.notifications;

    new Observable<INotificationMessage>()
      .pipe(merge(searchStarts))
      .pipe(merge(searchProgressReportDone))
      .pipe(merge(searchResultFound))
      .pipe(merge(searchStops))
      .subscribe((message) => {
        ctx.postMessage(message);
      });

    knightTour.search(actionMessage.tag);
  }
});

ctx.addEventListener("error", (error) => {
  const errorMessage: ISearchErrorMessage = {
    tag: tag,
    type: Notifications.SearchError,
    message: error.message,
  };

  ctx.postMessage(errorMessage);
});
