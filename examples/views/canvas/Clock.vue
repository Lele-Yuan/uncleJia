<template>
<canvas id="clockCanvas" width="400" height="200"></canvas>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

let canvas = null as any, ctx = null as any;
const oneCircle = 2 * Math.PI;
const clockSize = 65;
onMounted(() => {
    canvas = document.getElementById('clockCanvas');
    ctx = canvas.getContext('2d');

    drowClock();
    setInterval(drowClock, 1000);
})

const drowClock = () => {
    ctx.save();
    ctx.clearRect(0, 0, 400, 200);
    ctx.fillStyle = 'gray';
    ctx.font = "18px serif";
    ctx.fillText('⏰ 时钟', 10, 30);
    // 将坐标移动到表盘圆形
    ctx.translate(250, 100);
    drawOutline(); // 绘制轮廓
    drawHands(); // 绘制表针
    drawScale(); // 绘制刻度
    ctx.restore();
};

const drawOutline = () => {
    // 先画个圆形表盘
    ctx.beginPath();
    ctx.arc(0, 0, clockSize, 0, oneCircle);
    ctx.stroke();
    // 再画一个圆形的表芯
    ctx.beginPath(); // 重新画一个圆形，如果不调用该方法会将两个圆形链起来
    ctx.arc(0, 0, 5, 0, oneCircle);
    ctx.stroke();
};
const getCurrentTimeDegs = () => {
    const time = new Date();
    const hour = time.getHours() % 12;
    const min = time.getMinutes();
    const second = time.getSeconds();
    return { 
        hour: oneCircle / 12 * hour + oneCircle / 12 / 60 * min, // 秒针转动的角度忽略
        min: oneCircle / 60 * min + oneCircle / 60 / 60 * second,
        second: oneCircle / 60 * second
    };
};
const drawHands = () => {
    const { hour, min, second } = getCurrentTimeDegs();
    ctx.save();
    // 时针
    ctx.rotate(hour);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -40);
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.restore();
    ctx.save();
    // 分针
    ctx.rotate(min);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -50);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.restore();
    ctx.save();
    // 秒针
    ctx.rotate(second);
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -55);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
};

const drawScale = () => {
    // 绘制刻度 小时、分钟
    for (let index = 0; index < 12; index++) {
        ctx.save();
        ctx.beginPath();
        ctx.rotate(oneCircle / 12 * index);
        ctx.moveTo(0, -clockSize);
        ctx.lineTo(0, -clockSize + 8);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
        for (let i = 1; i < 5; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.rotate(oneCircle / 12 * index + oneCircle / 12 / 5 * i);
            ctx.moveTo(0, -clockSize);
            ctx.lineTo(0, -clockSize + 6);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
    }
};

</script>

<style lang="less" scoped>
</style>
