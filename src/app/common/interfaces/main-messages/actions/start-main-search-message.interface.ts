import { MainActions } from "../../../enums/main-actions.enum";

import { IMainActionMessage } from "./main-action-message.interface";

export interface IStartMainSearchMessage extends IMainActionMessage {
  type: MainActions.SearchStart;
  reportInterval: number;
}
