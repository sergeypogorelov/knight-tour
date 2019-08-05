import { IActionMessage } from "../../common/interfaces/messages/actions/action-message.interface";
import { ISearchStartedMessage } from "../../common/interfaces/messages/notifications/search-started.interface";
import { Notifications } from "../../common/enums/notifications.enum";
import { IStartSearchMessage } from "../../common/interfaces/messages/actions/start-search-message.interface";
import { Board } from "../../common/entities/board.class";
import { KnightTour } from "./entities/knight-tour.class";

const ctx: Worker = self as any;

ctx.addEventListener('message', ev => {
    /// worker message handler
});
