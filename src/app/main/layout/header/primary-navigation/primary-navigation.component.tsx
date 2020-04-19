import * as React from "react";

import { primaryNavigationItems } from "./primary-navigation-items";
import { PrimaryNavigationItem } from "./primary-navigation-item/primary-navigation-item.component";

export class PrimaryNavigation extends React.Component {
  render() {
    return (
      <div className="nav nav-pills">
        {primaryNavigationItems.map((props) => (
          <PrimaryNavigationItem key={props.href} {...props} />
        ))}
      </div>
    );
  }
}
