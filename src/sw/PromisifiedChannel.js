
export class PromisifiedChannel extends BroadcastChannel {

  constructor(onMessage) {
    super('channel4');
    const echo = (event) => {
      if(!onMessage?.(event) && event.data?.type) {
        this.postMessage({type: event.data?.type, ok: true});
      }
    };
    this.addEventListener('message', echo);
  }

  exchange(data) {
    return new Promise((resolve, reject) => {
      const {type} = data;
      if(!type) {
        return reject(new Error('notify type not defined'));
      }
      const receiver = (event) => {
        if(event.data.type === type) {
          clearTimeout(timer);
          this.removeEventListener('message', receiver);
          resolve(event.data);
        }
      };
      this.addEventListener('message', receiver);
      this.postMessage(data);
      const timer = setTimeout(() => {
        this.removeEventListener('message', receiver);
        reject(new Error('timeout'));
      }, 5000);
    });
  }

}
