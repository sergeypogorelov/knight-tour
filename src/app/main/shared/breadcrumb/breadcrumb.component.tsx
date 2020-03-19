import * as React from "react";

import { BreadcrumbProps } from "./breadcrumb-props.interface";

import { BreadcrumbItemComponent } from "./breadcrumb-item/breadcrumb-item.component";

export class BreadcrumbComponent extends React.Component<BreadcrumbProps> {
  render() {
    if (!this.props.items || this.props.items.length === 0) {
      return null;
    }

    return (
      <div className="breadcrumb">
        {this.props.items.map(props => (
          <BreadcrumbItemComponent key={props.to} {...props} />
        ))}
      </div>
    );
  }
}
