self && (self.onmessage = (e: any) => {
    console.log(e.data);
    self.postMessage && self.postMessage(e.data, '');
})