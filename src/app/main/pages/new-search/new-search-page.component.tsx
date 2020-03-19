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
      <div>
        <BreadcrumbComponent items={this.state.breadcrumb.items} />
        <div className="container">
          <h2>New Search</h2>
          <form>
            <div className="form-row">
              <div className="form-group col">
                <label>Count of rows</label>
                <select className="form-control">
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
              <div className="form-group col">
                <label>Max count of threads</label>
                <select className="form-control">
                  <option>1</option>
                  <option>2</option>
                  <option>4</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col">
                <label>Count of columns</label>
                <select className="form-control">
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </select>
              </div>
              <div className="form-group col">
                <label>Algorithm</label>
                <select className="form-control">
                  <option>Brute Force</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </form>
        </div>
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
