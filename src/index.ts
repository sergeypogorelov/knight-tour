/// import globals styles
import './index.scss';

/// import the application class
import { App } from './app/app.class';

/// run the application
App.mainInstance.run();

// import * as workerPath from "file-loader?name=[name].js!./test.worker";

// const worker = new Worker(workerPath);

// console.log(workerPath, worker);
// worker.addEventListener('message', message => {
//     console.log(message);
// });
// worker.postMessage('this is a test message to the worker');
