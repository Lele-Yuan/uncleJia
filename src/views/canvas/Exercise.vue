<template>
    <canvas id="graphCanvas" width="400" height="300"></canvas>
    <canvas id="myCanvas" width="400" height="300"></canvas>
    <!-- <canvas id="canvas" width="400" height="300" style="background: #c2cdf9;"></canvas> -->
    <div>
        <canvas id="myBg" width="1920" height="500"></canvas>
        <canvas id="myBg1" width="6000" height="500"></canvas>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import Star from './star';

let canvas = null;
let ctx = null as any;
const directiveY = 120;
const lineHeight = 100;
const directiveX = 100;
const drawLine = (lineCap: string, order: number) => {
    // 渐变
    // const gradient = ctx.createLinearGradient(0, 100, 100, 300);
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    // const gradient = ctx.createRadialGradient(200, 200, 10, 200, 200, 200);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(.5, 'white');
    gradient.addColorStop(1, 'green');
    ctx.strokeStyle = gradient;
    // 阴影
    ctx.shadowColor = "green";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;

    // 文字样式 绘制文字
    ctx.lineWidth = 1;
    ctx.font = "30px serif";
    var text = ctx.measureText(lineCap);
    ctx.strokeText(lineCap, directiveX * order - text.width / 2, directiveY - 30);

    // 线段的样式 绘制线段
    ctx.lineWidth = 15;
    ctx.lineCap = lineCap;
    ctx.beginPath();
    ctx.moveTo(directiveX * order,directiveY);
    ctx.lineTo(directiveX * order,(directiveY + lineHeight));
    ctx.closePath();
    ctx.stroke();
    ctx.closePath();
};

const drawBaseLine = () => {
    // 绘制虚线基准线
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, directiveY);
    ctx.lineTo(400, directiveY);
    ctx.stroke();
    // ctx.beginPath();
    ctx.lineWidth = 0.4;
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 10, 15]);
    ctx.moveTo(0, (directiveY + lineHeight));
    ctx.lineTo(400, (directiveY + lineHeight));
    ctx.stroke();
};

const drawLines = () => {
    canvas = document.getElementById('myCanvas') as any;
    ctx = canvas.getContext('2d');
    ctx.scale(2,2);
    ctx.transform(0.5,0,0,0.5,0,0);
    // ctx.setTransform(0.5,0,0,0.5,0,0);
    drawLine("butt", 1);
    drawLine("round", 2);
    drawLine("square", 3);
    drawBaseLine();
};

const drawBg = () => {
    const canvasBg = document.getElementById('myBg') as any;
    const ctxBg = canvasBg.getContext('2d');
    ctxBg.globalCompositeOperation = 'destination-over';
    ctxBg.fillStyle = '#2F5BEA';
    ctxBg.beginPath();
    ctxBg.moveTo(0, 0);
    ctxBg.lineTo(1920, 0);
    ctxBg.lineTo(1920, 410);
    ctxBg.lineTo(820, 500);
    ctxBg.lineTo(0, 350);
    ctxBg.closePath();
    ctxBg.fill();

    ctxBg.fillStyle = '#c2cdf9';
    ctxBg.beginPath();
    ctxBg.moveTo(0, 0);
    ctxBg.lineTo(1920, 0);
    ctxBg.lineTo(1920, 425);
    ctxBg.lineTo(520, 500);
    ctxBg.lineTo(0, 410);
    ctxBg.closePath();
    ctxBg.fill();

    var base64Img = canvasBg.toDataURL('image/png');
    // console.log(base64Img);
};
const drawBg1 = () => {
    const canvasBg = document.getElementById('myBg1') as any;
    const ctxBg = canvasBg.getContext('2d');
    ctxBg.globalCompositeOperation = 'destination-over';
    ctxBg.fillStyle = '#2F5BEA';
    ctxBg.beginPath();
    ctxBg.moveTo(0, 0);
    ctxBg.lineTo(6000, 0);
    ctxBg.lineTo(5000, 0);
    ctxBg.lineTo(3200, 500);
    // ctxBg.lineTo(0, 350);
    ctxBg.closePath();
    ctxBg.fill();

    ctxBg.fillStyle = '#c2cdf9';
    ctxBg.beginPath();
    ctxBg.moveTo(700, 0);
    ctxBg.lineTo(6000, 0);
    ctxBg.lineTo(6000, 0);
    ctxBg.lineTo(2900, 500);
    ctxBg.closePath();
    ctxBg.fill();

    var base64Img = canvasBg.toDataURL('image/png');
    console.log(base64Img);
};

const drawStar = () => {
    const WIDTH = 400;
    const HEIGHT = 300;
    const canvas = document.getElementById('canvas') as any;
    const ctx = canvas.getContext('2d');
    const stars = [] as any[];
    for (var i = 0; i < 30; i++) {
        stars[i] = new Star(i, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT),true);
        //stars[i].draw();
    }
    // const star = new Star(0, Math.floor(Math.random()*WIDTH), Math.floor(Math.random()*HEIGHT),true);
    const animate = () => {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (var i in stars) {
            stars[i].move();
        }
        requestAnimationFrame(animate);
    }
    animate();
}

let graphCanvas = null;
let ctxGraph = null as any;

const drawCircleRect = (x: number, y: number, width: number, height: number, radio: number) => {
    ctxGraph.beginPath();
    ctxGraph.moveTo(x, radio + y);
    ctxGraph.arcTo(x, height + y, width + x, height + y, radio);
    ctxGraph.arcTo(width + x, height + y, width + x, y, radio);
    ctxGraph.arcTo(width + x, y, x, y, radio);
    ctxGraph.arcTo(x, y, x, radio + y, radio);
    ctxGraph.fill()
}

const drawGraph = () => {
    graphCanvas = document.getElementById('graphCanvas') as any;
    ctxGraph = graphCanvas.getContext('2d');
    ctxGraph.lineWidth = 0.4;
    ctxGraph.fillStyle = '#2F5BEA';
    ctxGraph.strokeStyle = '#2F5BEA';
    
    ctxGraph.save();

    // 方法1，两条边都从圆心开始画
    ctxGraph.translate(30,30);
    ctxGraph.save();
    ctxGraph.arc(0,0,30,0,45*Math.PI/180);
    ctxGraph.restore();
    ctxGraph.moveTo(0,0);
    ctxGraph.lineTo(30,0);
    ctxGraph.rotate(45*Math.PI/180);
    ctxGraph.moveTo(0,0);
    ctxGraph.lineTo(30,0);
    ctxGraph.stroke();


    ctxGraph.restore();
    ctxGraph.save();

    // // 方法2，利用笔触位置绘制两条边
    ctxGraph.beginPath();
    ctxGraph.translate(90,30);
    ctxGraph.arc(0,0,30,45*Math.PI/180, 0, true);
    ctxGraph.lineTo(0,0);
    ctxGraph.rotate(45*Math.PI/180);
    ctxGraph.lineTo(30,0);
    ctxGraph.stroke();

    ctxGraph.restore();
    ctxGraph.save();

    // 方法3，利用beginPath closePath
    ctxGraph.beginPath();
    ctxGraph.translate(150,30);
    ctxGraph.moveTo(0,0);
    ctxGraph.arc(0,0,30,0,45*Math.PI/180);
    ctxGraph.closePath();
    ctxGraph.stroke();

    ctxGraph.restore();
    // ctxGraph.translate(30, 90);
    drawCircleRect(30, 90, 100, 30, 10);
};

onMounted(() => {
    drawGraph();
    drawLines();
    drawBg();
    drawBg1();
    // drawStar();
})
</script>

<style lang="less" scoped>
#myBg {
    width: 400px;
    height: 200px;
    border: none;
    display: block;
}
#myBg1 {
    width: 400px;
    height: 40px;
    display: block;
    margin-top: 20px;
}
</style>
