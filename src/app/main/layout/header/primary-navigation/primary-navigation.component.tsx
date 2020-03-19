import * as React from "react";

import { primaryNavigationItems } from "./primary-navigation-items";
import { PrimaryNavigationItemComponent } from "./primary-navigation-item/primary-navigation-item.component";

export class PrimaryNavigationComponent extends React.Component {
  render() {
    return (
      <div className="nav nav-pills">
        {primaryNavigationItems.map(props => (
          <PrimaryNavigationItemComponent
            key={props.href}
            href={props.href}
            label={props.label}
          />
        ))}
      </div>
    );
  }
}
