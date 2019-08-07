import { IBoard } from "../../board.interface";
import { IActionMessage } from "./action-message.interface";
import { Actions } from "../../../enums/actions.enum";

export interface IStartSearchMessage extends IActionMessage {
    type: Actions.SearchStart;
    board: IBoard;
}
