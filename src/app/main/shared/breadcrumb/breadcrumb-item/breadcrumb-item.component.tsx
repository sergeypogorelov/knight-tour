import * as React from "react";
import { NavLink } from "react-router-dom";

import { BreadcrumbItemProps } from "./breadcrumb-item-props.interface";

export const BreadcrumbItem = (props: BreadcrumbItemProps) => (
  <NavLink className="breadcrumb-item" activeClassName="active" to={props.to}>
    {props.label}
  </NavLink>
);
