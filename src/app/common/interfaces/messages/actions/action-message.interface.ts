import { Actions } from "../../../enums/actions.enum";

export interface IActionMessage {
    tag: string;
    type: Actions;
}
