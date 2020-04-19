import * as React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { urlFragments } from "./main/constants/url-fragments";

import { IFullSearchInfo } from "./common/interfaces/full-search-info.interface";
import { AppState } from "./app-state.interface";

import { Header } from "./main/layout/header/header.component";
import { Footer } from "./main/layout/footer/footer.component";

import { HomePage } from "./main/pages/home/home-page.component";
import { NewSearchPage } from "./main/pages/new-search/new-search-page.component";
import { CurrentSearchPage } from "./main/pages/current-search/current-search-page.component";
import { NotFoundPage } from "./main/pages/not-found/not-found-page.component";

export class App extends React.Component<any, AppState> {
  state: AppState = {
    fullSearchInfo: null,
  };

  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact>
            <Redirect to={`/${urlFragments.home}`} />
          </Route>
          <Route path={`/${urlFragments.home}`}>
            <HomePage />
          </Route>
          <Route path={`/${urlFragments.newSearch}`}>
            <NewSearchPage setFullSearchInfo={this.setFullSearchInfo} />
          </Route>
          <Route path={`/${urlFragments.currentSearch}`}>
            <CurrentSearchPage fullSearchInfo={this.state.fullSearchInfo} />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
        <Footer />
      </Router>
    );
  }

  setFullSearchInfo = (info: IFullSearchInfo) => {
    const { algorithm, firstMoveBoard, maxCountOfThreads } = info;

    const newState: AppState = {
      ...this.state,
      fullSearchInfo: {
        firstMoveBoard,
        algorithm,
        maxCountOfThreads,
      },
    };

    this.setState(newState);
  };
}
