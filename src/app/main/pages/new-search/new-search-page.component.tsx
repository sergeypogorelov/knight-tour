import * as React from "react";

import { urlFragments } from "../../constants/url-fragments";
import { labels } from "../../constants/labels";

import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { NewSearchPageState } from "./new-search-page-state.interface";

import { BreadcrumbComponent } from "../../shared/breadcrumb/breadcrumb.component";

export class NewSearchPageComponent extends React.Component {
  state: NewSearchPageState = {
    breadcrumb: {
      items: []
    }
  };

  componentDidMount() {
    this.setBreadcrumb();
  }

  render() {
    return (
      <div className="container">
        <h2>New Search</h2>
        <BreadcrumbComponent items={this.state.breadcrumb.items} />
      </div>
    );
  }

  private setBreadcrumb() {
    const partialState: { breadcrumb: BreadcrumbProps } = {
      breadcrumb: {
        items: [
          {
            to: `/${urlFragments.home}`,
            label: labels.home
          },
          {
            to: `/${urlFragments.newSearch}`,
            label: labels.newSearch
          }
        ]
      }
    };

    const state: NewSearchPageState = {
      ...this.state,
      ...partialState
    };

    this.setState(state);
  }
}
