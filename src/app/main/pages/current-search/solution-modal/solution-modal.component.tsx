import * as React from "react";
import classNames from "classnames";

import { BoardProps } from "../../../shared/board/board-props.interface";
import { SolutionModalProps } from "./solution-modal-props.interface";

import { Board } from "../../../shared/board/board.component";

export const SolutionModal = (props: SolutionModalProps) => {
  const isShown = Boolean(props.solution);

  const boardProps: BoardProps = {
    value: props.solution,
    readonly: true,
  };

  const className = classNames({
    modal: true,
    "d-block": isShown,
  });

  return (
    <div className={className}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Random Solution</h5>
          </div>
          <div className="modal-body d-flex justify-content-center">
            {isShown ? <Board {...boardProps} /> : null}
          </div>
          <div className="modal-footer d-flex justify-content-center">
            <button
              className="btn btn-primary"
              type="button"
              onClick={props.onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
