import * as React from "react";

import { PrimaryNavigationItemProps } from "./primary-navigation-item-props.interface";

export const PrimaryNavigationItemComponent = (
  props: PrimaryNavigationItemProps
) => (
  <div className="nav-item">
    <a className="nav-link" href="#">
      {props.label}
    </a>
  </div>
);
