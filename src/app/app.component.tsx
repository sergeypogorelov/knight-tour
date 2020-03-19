import * as React from "react";

import BruteForceWorker from "worker-loader!./workers/brute-force";

import { Actions } from "./common/enums/actions.enum";
import { IStartSearchMessage } from "./common/interfaces/messages/actions/start-search-message.interface";

import { HeaderComponent } from "./main/layout/header/header.component";
import { FooterComponent } from "./main/layout/footer/footer.component";

import { HomePageComponent } from "./main/pages/home/home-page.component";

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
      <div className="wrapper">
        <HeaderComponent />
        <HomePageComponent />
        <FooterComponent />
      </div>
    );
  }
}
