
export default function ({utils}) {
  utils.wss = {
    stack: [],
    request() {
      for(const {resolve, reject} of this.stack) {
        resolve(null);
      }
      this.stack.length = 0;
      return new Promise((resolve, reject) => {
        this.stack.push({resolve, reject});
      });
    },
    send(data) {
      for(const {resolve, reject} of this.stack) {
        resolve(data);
      }
      this.stack.length = 0;
    }
  }
}

/*
  {"id": 1, "method": "Runtime.evaluate", "params": {"expression": "$p.utils.wss.request()"}}
  {"id": 1, "method": "Runtime.awaitPromise", "params": {"promiseObjectId": "4765855619456017046.1.3", "returnByValue": true, "generatePreview": false}}
  {"id": 1, "method": "Page.bringToFront", "params": null}
*/
