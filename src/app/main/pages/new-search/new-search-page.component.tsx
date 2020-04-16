import * as React from "react";
import { Redirect } from "react-router-dom";

import { urlFragments } from "../../constants/url-fragments";
import { labels } from "../../constants/labels";

import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { NewSearchPageProps } from "./new-search-page-props.interface";
import { NewSearchPageState } from "./new-search-page-state.interface";
import { NewSearchFormResult } from "./new-search-form/new-search-form-result.interface";

import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { NewSearchForm } from "./new-search-form/new-search-form.component";

export class NewSearchPageComponent extends React.Component<
  NewSearchPageProps,
  NewSearchPageState
> {
  state: NewSearchPageState = {
    redirect: false,
    breadcrumb: {
      items: [],
    },
  };

  componentDidMount() {
    this.setBreadcrumb();
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={urlFragments.currentSearch} />;
    }

    return (
      <div>
        <BreadcrumbComponent items={this.state.breadcrumb.items} />
        <div className="container">
          <h2>New Search</h2>
          <NewSearchForm onSubmit={this.handleFormSubmit} />
        </div>
      </div>
    );
  }

  handleFormSubmit = (result: NewSearchFormResult) => {
    const { firstMoveBoard, algorithm, maxCountOfThreads } = result;

    this.props.setFullSearchInfo({
      firstMoveBoard,
      algorithm,
      maxCountOfThreads,
    });

    const newState: NewSearchPageState = {
      ...this.state,
      redirect: true,
    };

    this.setState(newState);
  };

  private setBreadcrumb() {
    const partialState: { breadcrumb: BreadcrumbProps } = {
      breadcrumb: {
        items: [
          {
            to: `/${urlFragments.home}`,
            label: labels.home,
          },
          {
            to: `/${urlFragments.newSearch}`,
            label: labels.newSearch,
          },
        ],
      },
    };

    const state: NewSearchPageState = {
      ...this.state,
      ...partialState,
    };

    this.setState(state);
  }
}
