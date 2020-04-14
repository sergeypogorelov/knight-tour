import * as React from "react";

import { SearchInfoProps } from "./search-info-props.interface";

export const SearchInfo = (props: SearchInfoProps) => {
  return (
    <div className="alert alert-info d-flex justify-content-around">
      <p className="m-0">Solutions found: {props.solutionsFound}</p>
      <p className="m-0">Moves Taken: {props.movesTaken}</p>
      <p className="m-0">Algorithm: {props.algorithm}</p>
    </div>
  );
};
