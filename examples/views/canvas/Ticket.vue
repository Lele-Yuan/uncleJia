<template>
<div class="">
    <canvas id="ticketCanvas" width="400" height="200" @mousedown="start" @mousemove="draw" @mouseup="stop"></canvas>
</div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

let canvas = null as any, ctx = null as any;
onMounted(() => {
    canvas = document.getElementById('ticketCanvas');
    ctx = canvas.getContext('2d');
    drawBg('谢谢惠顾');
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,400,300);
    // ctx.fillStyle = "#fff";
    // ctx.font = "48px serif";
    // ctx.fillText('刮刮乐', 130, 130);
})

let isDraw = false;

const drawBg = (text: string) => {
    // const canvasBg = document.getElementById('bg') as any;
    const canvasBg = document.createElement('canvas');
    canvasBg.width = 400;
    canvasBg.height = 200;
    const ctxBg = canvasBg.getContext('2d') as any;
    // ctxBg.fillStyle = 'gray';
    ctxBg.font = "40px serif";
    const textMeasure = ctx.measureText(text);
    ctxBg.fillText(text, 130, 130);
    const base64Img = canvasBg.toDataURL('image/png');
    canvas.style.background = `url(${base64Img})`;
}

const start = (event: any) => {
    isDraw = true;
    const x = event.offsetX;
    const y = event.offsetY;
    lastX = x;
    lastY = y;
}
const draw = (event: any) => {
    if (!isDraw) return;
    ctx.beginPath();
    const x = event.offsetX;
    const y = event.offsetY;
    
    // 画线
    ctx.globalCompositeOperation = 'destination-out';
    // drawLine(x, y);

    // 画圆
    ctx.globalCompositeOperation = 'destination-out';
    ctx.arc(x, y, 20, 0, 2*Math.PI);
    ctx.fill();

    // 擦除
    // clearArc(x, y, 10);
}


const stop = (event: any) => {
    isDraw = false;
}

let stepClear = 1;
function clearArc(x:number, y: number, radius: number){//圆心(x,y)，半径radius
    var calcWidth = radius - stepClear;
    var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
    
    var posX = x - calcWidth;
    var posY = y - calcHeight;
    
    var widthX = 2 * calcWidth;
    var heightY = 2 * calcHeight;
    
    if (stepClear <= radius) {
        ctx.clearRect(posX, posY, widthX, heightY);
        stepClear++;
        clearArc(x, y, radius);
    } else {
        stepClear = 1
    }
}

let lastX = 0, lastY = 0;
const drawLine = (x: number, y: number) => {
    ctx.beginPath();
    ctx.lineWidth = 20; //设置线宽状态
    ctx.strokeStyle = 'red'; //设置线的颜色状态
    ctx.lineCap = 'round'
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    // 每次移动都要更新坐标位置
    lastX = x;
    lastY = y;
}

</script>

<style lang="less" scoped>
.text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 50px;
    font-weight: bold;
}
</style>
