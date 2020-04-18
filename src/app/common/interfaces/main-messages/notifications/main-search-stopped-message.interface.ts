import { MainNotifications } from "../../../enums/main-notifications.enum";
import { IMainSearchReportMessage } from "./main-search-report-message.interface";

export interface IMainSearchStoppedMessage {
  type: MainNotifications.SearchStopped;
  lastReport?: IMainSearchReportMessage;
}
