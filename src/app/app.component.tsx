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

import { HeaderComponent } from "./main/layout/header/header.component";
import { FooterComponent } from "./main/layout/footer/footer.component";

import { HomePageComponent } from "./main/pages/home/home-page.component";
import { NewSearchPageComponent } from "./main/pages/new-search/new-search-page.component";
import { CurrentSearchPage } from "./main/pages/current-search/current-search-page.component";
import { NotFoundPageComponent } from "./main/pages/not-found/not-found-page.component";

export class AppComponent extends React.Component<any, AppState> {
  state: AppState = {
    fullSearchInfo: null,
  };

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
            <NewSearchPageComponent
              setFullSearchInfo={this.setFullSearchInfo}
            />
          </Route>
          <Route path={`/${urlFragments.currentSearch}`}>
            <CurrentSearchPage fullSearchInfo={this.state.fullSearchInfo} />
          </Route>
          <Route path="*">
            <NotFoundPageComponent />
          </Route>
        </Switch>
        <FooterComponent />
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
