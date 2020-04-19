import * as React from "react";
import { NavLink } from "react-router-dom";

import { PrimaryNavigationItemProps } from "./primary-navigation-item-props.interface";

export const PrimaryNavigationItem = (props: PrimaryNavigationItemProps) => (
  <div className="nav-item">
    <NavLink className="nav-link" activeClassName="active" to={props.href}>
      {props.label}
    </NavLink>
  </div>
);
