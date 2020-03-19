import * as React from "react";

import { LogoComponent } from "./logo/logo-component";
import { PrimaryNavigationComponent } from "./primary-navigation/primary-navigation.component";

export class HeaderComponent extends React.Component {
  render() {
    return (
      <div className="navbar navbar-light bg-light">
        <LogoComponent />
        <PrimaryNavigationComponent />
      </div>
    );
  }
}
