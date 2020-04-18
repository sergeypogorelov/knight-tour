import { MainActions } from "../../../enums/main-actions.enum";

import { IMainActionMessage } from "./main-action-message.interface";

export interface IStopMainSearchMessage extends IMainActionMessage {
  type: MainActions.SearchStart;
  force: boolean;
}
