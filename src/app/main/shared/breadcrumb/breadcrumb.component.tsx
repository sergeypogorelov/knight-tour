import * as React from "react";

import { BreadcrumbProps } from "./breadcrumb-props.interface";

import { BreadcrumbItem } from "./breadcrumb-item/breadcrumb-item.component";

export class Breadcrumb extends React.Component<BreadcrumbProps> {
  render() {
    if (!this.props.items || this.props.items.length === 0) {
      return null;
    }

    return (
      <div className="breadcrumb">
        {this.props.items.map((props) => (
          <BreadcrumbItem key={props.to} {...props} />
        ))}
      </div>
    );
  }
}
