import { IBoard } from "../../../../common/interfaces/board.interface";

export interface SolutionModalProps {
  solution: IBoard;
  onClose(): void;
}
