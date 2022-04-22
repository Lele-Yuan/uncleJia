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

let canvas = null as any, ctx = null as any;
onMounted(() => {
    canvas = document.getElementById('signCanvas');
    ctx = canvas.getContext('2d');
})

let isDraw = false;
let lastX = 0, lastY = 0, WIDTH = 400, HEIGHT = 200;
const imgStack = [] as any[];

const start = (event: any) => {
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
