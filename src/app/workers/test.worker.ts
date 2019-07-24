interface Test {
    prop: string;
}

const item: Test = { prop: 'qq' };

console.log('hello from a webworker', item);

addEventListener('message', (message) => {
    console.log('in webworker', message);
    postMessage('this is the response ' + message.data);
});
