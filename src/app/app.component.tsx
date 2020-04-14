import * as React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import BruteForceWorker from "worker-loader!./workers/brute-force";

import { urlFragments } from "./main/constants/url-fragments";

import { Actions } from "./common/enums/actions.enum";
import { IStartSearchMessage } from "./common/interfaces/messages/actions/start-search-message.interface";

import { HeaderComponent } from "./main/layout/header/header.component";
import { FooterComponent } from "./main/layout/footer/footer.component";

import { HomePageComponent } from "./main/pages/home/home-page.component";
import { NewSearchPageComponent } from "./main/pages/new-search/new-search-page.component";
import { CurrentSearchPage } from "./main/pages/current-search/current-search-page.component";
import { NotFoundPageComponent } from "./main/pages/not-found/not-found-page.component";

export class AppComponent extends React.Component {
  // componentDidMount() {
  //   const worker = new BruteForceWorker();

  //   worker.onmessage = ev => console.log(ev);
  //   worker.onerror = ev => console.error(ev);

  //   const message: IStartSearchMessage = {
  //     type: Actions.SearchStart,
  //     tag: "main",
  //     board: {
  //       cells: [
  //         [-1, -1, -1, -1, -1],
  //         [-1, -1, -1, -1, -1],
  //         [-1, -1, 0, -1, -1],
  //         [-1, -1, -1, -1, -1],
  //         [-1, -1, -1, -1, -1]
  //       ]
  //     },
  //     maxThreadCount: 2
  //   };

  //   worker.postMessage(message);
  // }

  render() {
    return (
      <Router>
        <HeaderComponent />
        <Switch>
          <Route path="/" exact>
            <Redirect to={`/${urlFragments.home}`} />
          </Route>
          <Route path={`/${urlFragments.home}`}>
            <HomePageComponent />
          </Route>
          <Route path={`/${urlFragments.newSearch}`}>
            <NewSearchPageComponent />
          </Route>
          <Route path={`/${urlFragments.currentSearch}`}>
            <CurrentSearchPage />
          </Route>
          <Route path="*">
            <NotFoundPageComponent />
          </Route>
        </Switch>
        <FooterComponent />
      </Router>
    );
  }
}
