import { Test } from '../interfaces/messages/test.interface';

const workerMessage: Test = { message: 'qq' };

addEventListener('message', (message) => {
    console.log('worker thread: ', message);
    postMessage(workerMessage);
});
