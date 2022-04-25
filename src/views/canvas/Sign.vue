<template>
<div class="sign-wrap">
    <div class="operate">
        <el-button size="mini" type="primary" @click="handleClear">清空</el-button>
        <el-button size="mini" type="primary" @click="handleReset">撤销一步</el-button>
        <el-button size="mini" type="primary" @click="handleConfirm">确定</el-button>
    </div>
    <canvas id="signCanvas" width="400" height="200" @mousedown="start" @mousemove="draw" @mouseup="stop"></canvas>
</div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { downloadUrl } from "../excelTable/utils";

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
const padding = 30, height = 30;
onMounted(() => {
    canvas = document.getElementById('signCanvas') as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // drawButtons('清空', 85, 10);
    // drawButtons('撤销一步', 155, 10);
    // drawButtons('保存', 250, 10);
})

let isDraw = false;
let lastX = 0, lastY = 0, WIDTH = 400, HEIGHT = 200;
const imgStack = [] as any[];

const getBtnLine = (text: string, x: number, y: number) => {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.font = '14px PingFang';
    const textMeasure = ctx.measureText(text);
    ctx.fillStyle = '#409eff';
    ctx.rect(x, y, textMeasure.width + padding, height);
};

const drawButtons = (text: string, x: number, y: number) => {
    getBtnLine(text, x, y);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '14px PingFang';
    ctx.fillText(text, x + padding / 2, height);
};

const click = (event: any) => {

    let clickBtn = false;
    const x = event.offsetX, y = event.offsetY;
    getBtnLine('清空', 85, 10);
    clickBtn = ctx.isPointInPath(x, y)
    if (clickBtn) {
        isDraw = false;
        handleClear();
        return;
    }
    getBtnLine('撤销一步', 155, 10);
    clickBtn = ctx.isPointInPath(x, y)
    if (clickBtn) {
        isDraw = false;
        handleReset();
        return;
    }
    getBtnLine('保存', 250, 10);
    clickBtn = ctx.isPointInPath(x, y)
    if (clickBtn) {
        isDraw = false;
        handleConfirm();
        return;
    }
}

const start = (event: any) => {
    // click(event);
    isDraw = true;
    lastX = event.offsetX;
    lastY = event.offsetY;
    let imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    imgStack.push(imgData);
}
const draw = (event: any) => {
    if (!isDraw) return;
    ctx.beginPath();
    const x = event.offsetX;
    const y = event.offsetY;
    
    // 画图
    // ctx.globalCompositeOperation = 'destination-out';
    drawLine(x, y);
}

const stop = (event: any) => {
    isDraw = false;
}

const drawLine = (x: number, y: number) => {
    ctx.beginPath();
    ctx.lineWidth = 2; //设置线宽状态
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

const handleClear = () => {
    imgStack.length = 0;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawButtons('清空', 85, 10);
    drawButtons('撤销一步', 155, 10);
    drawButtons('保存', 250, 10);
}
const handleReset = () => {
    if (imgStack.length === 0) return;
    ctx.putImageData(imgStack.pop(), 0, 0);
}
const handleConfirm = () => {
    const base64Img = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = base64Img;
    downloadUrl(base64Img, '签名.png');
}
</script>

<style lang="less" scoped>
.operate {
    margin-bottom: 10px;
}
</style>
