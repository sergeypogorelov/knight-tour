import { IMatrixCoordinate } from "../../../common/interfaces/matrix-coordinate.interface";
import { IBoard } from "../../../common/interfaces/board.interface";
import { INotifications } from "../interfaces/notifications.interface";

import { Board } from "../../../common/entities/board.class";
import { Knight } from "../../../common/entities/knight.class";
import { NotificationsWrapper } from "./notifications-wrapper.class";

const PROGRESS_DIVIDER = 1000;

/**
 * Knight's Tour search
 */
export class KnightTour {
  /**
   * current knight
   */
  get knight(): Knight {
    return this._knight;
  }

  /**
   * notifications from the search of the Knight's Tour
   */
  get notifications(): INotifications {
    return this._notificatiionsWrapper.interface;
  }

  /**
   * creates Knight's Tour search with specified board
   *
   * @param board chess board
   */
  constructor(board: Board) {
    if (!board) throw new Error("Board is not specified.");

    this._knight = new Knight(board);
    this._notificatiionsWrapper = new NotificationsWrapper();
  }

  /**
   * searches for the Knight's Tour
   */
  search(tag: string): IBoard[] {
    this._tag = tag;

    this._movesTaken = 0;
    this._movesUntaken = 0;

    this._foundSolutions = [];

    const lastMove = this.knight.findLastMove();
    const moveNumber = this.knight.board.cells[lastMove.row][lastMove.column];

    this._notificatiionsWrapper.notifySearchStarted(
      this._tag,
      this.knight.board.asJSON()
    );
    this.searchKnightTour(lastMove, moveNumber);
    this._notificatiionsWrapper.notifySearchStopped(
      this._tag,
      this._movesTaken
    );

    return this._foundSolutions;
  }

  /**
   * thread tag
   */
  private _tag: string;

  /**
   * current knight
   */
  private _knight: Knight;

  /**
   * notifications wrapper
   */
  private _notificatiionsWrapper: NotificationsWrapper;

  /**
   * found solutions during the last search
   */
  private _foundSolutions: IBoard[];

  /**
   * count of taken moves
   */
  private _movesTaken: number;

  /**
   * count of untaken moves
   */
  private _movesUntaken: number;

  /**
   * searches for the Knight's Tour based on the last move of the knight
   *
   * @param lastMoveCoordinate move coordinate
   * @param lastMoveNumber move number
   */
  private searchKnightTour(
    lastMoveCoordinate: IMatrixCoordinate,
    lastMoveNumber: number
  ): IBoard {
    const maxMovesCount = this.knight.maxCountOfMoves;

    if (lastMoveNumber === maxMovesCount - 1) {
      return this.knight.board.asJSON();
    } else {
      const availableMoves = this.knight.findAllAvailableMoves(
        lastMoveCoordinate
      );
      for (let i = 0; i < availableMoves.length; i++) {
        const newMove = availableMoves[i];
        const newMoveNumber = lastMoveNumber + 1;

        this.knight.takeMove(newMove, newMoveNumber);
        this._movesTaken++;

        if (this._movesTaken % PROGRESS_DIVIDER === 0) {
          this._notificatiionsWrapper.notifySearchProgress(
            this._tag,
            this._movesTaken,
            this._movesUntaken
          );
        }

        const result = this.searchKnightTour(newMove, newMoveNumber);
        if (result) {
          this._notificatiionsWrapper.notifySearchResult(this._tag, result);
          this._foundSolutions.push(result);
        }

        this.knight.untakeMove(newMove);
        this._movesUntaken++;

        if (this._movesUntaken % PROGRESS_DIVIDER === 0) {
          this._notificatiionsWrapper.notifySearchProgress(
            this._tag,
            this._movesTaken,
            this._movesUntaken
          );
        }
      }
    }

    return null;
  }
}
