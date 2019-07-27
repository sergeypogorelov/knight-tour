import { Test } from '../interfaces/messages/test.interface';

const ctx: Worker = self as any;

const workerMessage: Test = { message: 'qq' };

ctx.addEventListener('message', (message) => {
    console.log('worker thread: ', message);
    ctx.postMessage(workerMessage);
});
