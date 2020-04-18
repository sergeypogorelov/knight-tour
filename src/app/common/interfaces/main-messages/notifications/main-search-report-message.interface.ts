import { MainNotifications } from "../../../enums/main-notifications.enum";
import { IBoard } from "../../board.interface";

export interface IMainSearchReportMessage {
  type: MainNotifications.SearchReport;
  boardsPerThread: IBoard[];
  totalSolutionsFound: number;
  totalMovesTaken: number;
  solutionsFoundCountPerThread: number[];
  movesTakenCountPerThread: number[];
  newSolutionsFoundPerThread: IBoard[][];
}
