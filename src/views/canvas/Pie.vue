<template>
<canvas id="pieCanvas" width="400" height="200" @mousemove="handleMousemove"></canvas>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

let canvas = null as any, ctx = null as any;
let cx: number, cy : number;
const iR = 60, oR = 90; // 内圆和外圆半径
const dataArr = [{
    data: 0.2,
    color: "#5470c6"
}, {
    data: 0.2,
    color: "#91cb75"
}, {
    data: 0.2,
    color: "#fac858"
}, {
    data: 0.2,
    color: "#ee6465"
}, {
    data: 0.2,
    color: "#73c0de"
}];
let hoverIndex = null as number | null;
const hoverRadio = 1.1;
onMounted(() => {
    canvas = document.getElementById('pieCanvas');
    ctx = canvas.getContext('2d');
    // 设置圆心位置
    cx = canvas.width / 2;
    cy = canvas.height / 2;
    ctx.translate(cx, cy); // 将画布原点移动到圆心

    render(true);
    
})
const speed = 10 / 180 * Math.PI;
const render = (animation = false) => {
    ctx.clearRect(-200, -100, 400, 200);
    let startAngle = 0, angle = 0, index = 0;
    const renderGraph = () => {
        const timmer = window.requestAnimationFrame(renderGraph);
        angle += speed;
        if (angle >= dataArr[index].data * 2 * Math.PI) {
            angle = dataArr[index].data * 2 * Math.PI;
        }
        drawSector(startAngle, startAngle + angle, dataArr[index].color, index);
        if (angle >= dataArr[index].data * 2 * Math.PI) {
            startAngle += dataArr[index].data * 2 * Math.PI;
            angle = 0;
            index ++;
            if (index === dataArr.length) cancelAnimationFrame(timmer);
        }
    }
    if (animation) renderGraph();
    else {
        for (let index = 0; index < dataArr.length; index++) {
            const angle = dataArr[index].data * 2 * Math.PI;
            drawSector(startAngle, startAngle + angle, dataArr[index].color, index);
            startAngle += angle;
        }
    }
}

const handleMousemove = (event: any) => {
    let startAngle = 0;
    const x = event.offsetX, y = event.offsetY;
    for (let index = 0; index < dataArr.length; index++) {
        const item = dataArr[index];
        const angle = item.data * 2 * Math.PI;
        getGraph(startAngle, startAngle + angle, iR);
        if (ctx.isPointInPath(x, y)) {
            if (hoverIndex !== null) {
                hoverIndex = null;
                render();
            }
            break;
        }
        getGraph(startAngle, startAngle + angle, oR);
        if (ctx.isPointInPath(x, y)) {
            if (hoverIndex !== index) {
                hoverIndex = index;
                render();
            }
            break;
        } else {
            if (hoverIndex !== null) {
                hoverIndex = null;
                render();
            }
        }
        startAngle += angle;
    }
    
};

const getGraph = (startAngle: number, endAngle: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // ctx.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle)); // 开始线
    ctx.arc(0, 0, radius, startAngle, endAngle); // 弧形
    ctx.closePath(); // 回到原心
};

const drawSector = (startAngle: number, endAngle: number, color: string, index: number) => {
    ctx.save();
    // 画外圆
    const outRadius = hoverIndex === index ? oR * hoverRadio : oR;
    getGraph(startAngle, endAngle, outRadius);
    ctx.fillStyle = color
    ctx.fill();

    ctx.globalCompositeOperation = 'destination-out';
    // 画内圆
    getGraph(startAngle, endAngle, iR);
    ctx.fill();

    // 内全画完后会留下一个边覆盖不全
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
};

</script>

<style lang="less" scoped>
#pieCanvas {
    width: 400px;
    height: 200px;
}
</style>
