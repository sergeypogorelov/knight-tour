import * as React from "react";

import { Logo } from "./logo/logo-component";
import { PrimaryNavigation } from "./primary-navigation/primary-navigation.component";

export class Header extends React.Component {
  render() {
    return (
      <div className="navbar navbar-light bg-light">
        <Logo />
        <PrimaryNavigation />
      </div>
    );
  }
}
