import { MainNotifications } from "../../../enums/main-notifications.enum";

export interface IMainSearchStartedMessage {
  type: MainNotifications.SearchStarted;
}
