import * as React from "react";

import { urlFragments } from "../../constants/url-fragments";
import { labels } from "../../constants/labels";

import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { NewSearchPageState } from "./new-search-page-state.interface";
import { NewSearchFormResult } from "./new-search-form/new-search-form-result.interface";

import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";
import { NewSearchForm } from "./new-search-form/new-search-form.component";

export class NewSearchPageComponent extends React.Component<
  object,
  NewSearchPageState
> {
  state: NewSearchPageState = {
    breadcrumb: {
      items: [],
    },
  };

  componentDidMount() {
    this.setBreadcrumb();
  }

  render() {
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
    console.log(result);
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
