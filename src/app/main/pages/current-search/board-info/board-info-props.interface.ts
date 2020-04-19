import { BoardInfoStatuses } from "./board-info-statuses.enum";

import { IBoard } from "../../../../common/interfaces/board.interface";

export interface BoardInfoProps {
  board: IBoard;
  status: BoardInfoStatuses;
  solutionsFound: number;
  movesTaken: number;
}
