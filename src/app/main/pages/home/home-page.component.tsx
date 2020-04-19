import * as React from "react";
import { NavLink } from "react-router-dom";

import { urlFragments } from "../../constants/url-fragments";

export const HomePage = () => (
  <div className="container mt-2">
    <div className="jumbotron">
      <h1 className="display-4">Knight's Tour</h1>
      <p className="lead">
        This application is created to search Knight's Tour.
      </p>
      <hr className="my-4" />
      <p>
        A knight's tour is a sequence of moves of a knight on a chessboard such
        that the knight visits every square exactly once. You can find more
        details on this by clicking the following{" "}
        <a href="https://en.wikipedia.org/wiki/Knight%27s_tour" target="_blank">
          link
        </a>
        .
      </p>
      <p>
        This application requires WEB Workers support. If your browser doesn't
        support it, the application is not going to work.
      </p>
      <NavLink
        className="btn btn-primary btn-lg"
        to={`/${urlFragments.newSearch}`}
      >
        Get Started
      </NavLink>
    </div>
  </div>
);
