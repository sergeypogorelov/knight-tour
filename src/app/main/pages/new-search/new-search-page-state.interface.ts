import { IBoard } from "../../../common/interfaces/board.interface";
import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";

export interface NewSearchPageState {
  breadcrumb: BreadcrumbProps;
  board: IBoard;
}
