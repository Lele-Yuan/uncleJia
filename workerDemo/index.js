const first = document.querySelector('#number1');
const second = document.querySelector('#number2');
const result = document.querySelector('.result');

const workerBlock = function(e) {
    console.log('inner Worker: Message received from main script');
    const result = e.data[0] * e.data[1];
    if (isNaN(result)) {
        postMessage('Please write two numbers');
    } else {
        const workerResult = 'Result: ' + result;
        console.log('inner Worker: Posting message back to main script');
        postMessage(workerResult);
    }
}

if (window.Worker) {
    /**
     * new Worker(jsURL[, options])
     * @param jsUrl 表示worker将要执行的脚本URL
     * @param options (可选)
     * @options type: 'classic', // 可选值为 classic 或 module ，默认classic
     * @options credentials: 'omit',
     * @options name 设置 DedicatedWorkerGlobalScope 全局对象的name属性。可以通过 _self.name 访问
     */
    // const myWorker = new Worker('worker.js', {
    //     name: 'workerScript'
    // })


    const blob = new Blob([`onmessage=${workerBlock.toString()}`], { "type": "text/javascript" });
    const url = window.URL.createObjectURL(blob);
    const myWorker = new Worker(url);

    first.onchange = function() {
        myWorker.postMessage([first.value, second.value]);
        console.log('Message posted to worker');
    }

    second.onchange = function() {
        myWorker.postMessage([first.value, second.value]);
        console.log('Message posted to worker');
    }

    myWorker.onmessage = function(e) {
        result.textContent = e.data;
        console.log('Message received from worker');
    }
}

