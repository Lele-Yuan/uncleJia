<template>
	<cover />
    <div class="border-wrap">
        <div class="item content rect-example">
			<div class="inner inner1">top-left</div>
			<div class="inner inner2">top-right</div>
			<div class="inner inner3">bottom-right</div>
			<div class="inner inner4">bottom-left</div>
		</div>
	</div>
	<div class="item content rect031">45px  30%  30%  45px</div>
    <div class="border-wrap">
        <div class="item content rect03">45px</div>
        <div class="item content rect021">30%</div>
        <div class="item content rect02">30%</div>
        <div class="item content rect00">50%</div>
        <div class="item content rect01">50%</div>
    </div>
    <div class="border-wrap">
        <div class="item content separa00">30% 70% 70% 30% / 30% 30% 70% 70%</div>
        <div class="item content separa01">30% 70% 70% 30% / 30% 30% 70% 70%</div>
        <div class="item separa02">
			<div class="circle circle1">90px * 10/11</div>
			<div class="circle circle2">40px</div>
		</div>
    </div>
	<div class="border-wrap" style="margin-top: 200px;">
        <div class="item separa03">
			<div class="circle circle1"></div>
			<div class="circle circle2"></div>
			<div class="circle circle3"></div>
			<div class="circle circle4"></div>
		</div>
		<div style="
			padding: 20px;
			text-align: left;
		">
			<div style="color: brown;">top-left: 30% 30%</div>
			<div style="
			color: coral;
		">top-right: 40% 30%</div>
			<div style="
			color: blueviolet;
		">bottom-right: 40% 40%</div>
			<div style="
			color: deeppink;
		">bottom-left: 30% 40%</div>
		</div>
        <div class="item separa04">
			<div class="circle circle1"></div>
			<div class="circle circle2"></div>
			<div class="circle circle4"></div>
			<div class="circle circle3"></div>
		</div>
	</div>
	<div class="border-wrap" style="margin-top: 20px;">
        <div class="item separa041">
			<div class="circle circle1">200px</div>
		</div>
		<div class="text">
			<div>width: 300px; height: 200px;</div>
			<div style="text-decoration: line-through;">border-radius: 900px 0 0 0 / 900px 0 0 0;</div>
			<div style="color:brown;">border-radius: 200px 0 0 0 / 200px 0 0 0;</div>
		</div>
        <div class="item separa041" style="border-radius: 900px 0 0 0 / 400px 0 0 0;">
			<div class="circle circle1" style="width: 300px; height: calc(400px/3)">300px  400/3px</div>
		</div>
		<div class="text">
			<div>width: 300px; height: 200px;</div>
			<div style="text-decoration: line-through;">border-radius: 900px 0 0 0 / 400px 0 0 0;</div>
			<div style="color:brown;">border-radius: 300px 0 0 0 / 400px/3 0 0 0;</div>
		</div>
	</div>
	<div class="border-wrap" style="margin-top: 20px;">
        <div class="item separa042">
			<div class="circle circle1">180px</div>
			<div class="circle circle2">120px</div>
		</div>
		<div class="text">
			<div>width: 300px; height: 200px;</div>
			<div style="text-decoration: line-through;">border-radius: 900px 600px 0 0 / 900px 600px 0 0;</div>
			<div style="color:brown;">border-radius: 180px 120px 0 0 / 180px 120px 0 0;</div>
		</div>
	</div>
	<div class="border-wrap">
		<div style="width: 400px; text-align: center;">
			<div class="item separa05" :style="borderStyle">
				<div class="circle circle1"></div>
				<div class="circle circle2"></div>
			</div>
			<div>
				border-radius: 
				{{ values[0] }}px {{ values[1] }}px {{ values[2] }}px {{ values[3] }}px / {{ values[4] }}px {{ values[5] }}px {{ values[6] }}px {{ values[7] }}px
			</div>
			<div>
				border-width: 
				{{ width0 }}px {{ width1 }}px {{ width2 }}px {{ width3 }}px
			</div>
		</div>
		<div class="slider-wrap">
			<el-slider v-model="value0"></el-slider>
			<el-slider v-model="value1"></el-slider>
			<el-slider v-model="value2"></el-slider>
			<el-slider v-model="value3"></el-slider>
			<div>/</div>
			<el-slider v-model="value4"></el-slider>
			<el-slider v-model="value5"></el-slider>
			<el-slider v-model="value6"></el-slider>
			<el-slider v-model="value7"></el-slider>
		</div>
		<div class="slider-wrap">
			<el-slider :min="0" :max="50" v-model="width0"></el-slider>
			<el-slider :min="0" :max="50" v-model="width1"></el-slider>
			<el-slider :min="0" :max="50" v-model="width2"></el-slider>
			<el-slider :min="0" :max="50" v-model="width3"></el-slider>
		</div>
	</div>
	<div class="links">
		<a href="https://www.zhangxinxu.com/wordpress/2015/11/css3-border-radius-tips/" target="_blank">css3深入理解之border-radius</a>
		<a href="https://www.zhangxinxu.com/wordpress/2015/11/css3-border-radius-tips/" target="_blank">鑫空间：CSS3 border-radius知多少？</a>
	</div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import cover from './cover.vue';
const width = 25;
const width0 = ref(width);
const width1 = ref(width);
const width2 = ref(width);
const width3 = ref(width);

const value0 = ref(0);
const value1 = ref(0);
const value2 = ref(0);
const value3 = ref(0);
const value4 = ref(0);
const value5 = ref(0);
const value6 = ref(0);
const value7 = ref(0);
const values = [value0, value1, value2, value3, value4, value5, value6, value7]
const borderStyle = computed(() => {
	return {
		'--border-width-top': `${width0.value}px`,
		'--border-width-right': `${width1.value}px`,
		'--border-width-bottom': `${width2.value}px`,
		'--border-width-left': `${width3.value}px`,

		'--border-left-top-radius-v': `${100 * values[0].value / 100}px`,
		'--border-right-top-radius-v': `${100 * values[1].value / 100}px`,
		'--border-right-bottom-radius-v': `${100 * values[2].value / 100}px`,
		'--border-left-bottom-radius-v': `${100 * values[3].value / 100}px`,
		'--border-left-top-radius-h': `${100 * values[4].value / 100}px`,
		'--border-right-top-radius-h': `${100 * values[5].value / 100}px`,
		'--border-right-bottom-radius-h': `${100 * values[6].value / 100}px`,
		'--border-left-bottom-radius-h': `${100 * values[7].value / 100}px`
	};
});

</script>

<style>
.border-wrap, .circle {
    display: flex;
    align-items: center;
    justify-content: center;
	flex-wrap: wrap;
}
.border-wrap {
	margin-bottom: 50px;
}

.item {
    background: linear-gradient(45deg, #be35fe 0%, #41d1ff 100%);
    margin: 20px;
	position: relative;
	text-align: center;
	color: #fff;
	font-size: 20px;
	font-family: fantasy;
	display: flex;
    justify-content: center;
    align-items: center;
}
.item.content::before, .circle {
	content: "";
	border-radius: 50%;
	border: 2px dashed #ccc;
	position: absolute;
	left: 0;
	top: 0;
	box-sizing: border-box;
	z-index: 2;
}

.rect00 {
    width: 200px;
    height: 200px;
    border-radius: 50%;
}
.rect01 {
    width: 300px;
    height: 200px;
    border-radius: 50%;
}
.rect02 {
    width: 300px;
    height: 200px;
    border-radius: 30%;
}
.rect02::before {
	width: 180px;
	height: 120px;
}
.rect021 {
    width: 200px;
    height: 200px;
    border-radius: 30%;
}
.rect021::before {
	width: 120px;
	height: 120px;
}
.rect03 {
    width: 300px;
    height: 200px;
    border-radius: 45px;
}
.rect03::before {
	width: 90px;
	height: 90px;
}
.rect031 {
    width: 300px;
    height: 200px;
    border-radius: 45px 30% 30% 45px;
}
.separa00 {
    width: 200px;
    height: 200px;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}
.separa01 {
    width: 300px;
    height: 200px;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}
.separa02 {
    width: 200px;
    height: 200px;
    border-radius: 76% 22% 24% 66% / 55% 46% 37% 31%;
}
.separa03 {
    width: 300px;
    height: 200px;
    border-radius: 76% 22% 24% 66% / 55% 46% 37% 31%;
}
/* f=min(L宽度/S宽度，L高度/S高度)，L为容器宽高，S为半径之和 300/220 200/220 */
.separa02 {
    width: 300px;
    height: 200px;
    border-radius: 180px 40px;
	position: relative;
}
.separa02 .circle1 {
	width: calc(10 / 11 * 360px);
	height: calc(10 / 11 * 360px);
}
.separa02 .circle2 {
	top: initial;
	bottom: 0;
	width: calc(10 / 11 * 80px);
	height: calc(10 / 11 * 80px);
}
.separa03 {
    width: 300px;
    height: 200px;
    border-radius: 30% 40% 40% 30% / 30% 30% 40% 40%;
	position: relative;
}
.separa03 .circle1 {
	width: 180px;
	height: 120px;
	border-color: brown;
}
.separa03 .circle2 {
	left: initial;
	right: 0;
	width: 240px;
	height: 120px;
	border-color: coral;
}
.separa03 .circle3 {
	left: initial;
	right: 0;
	top: initial;
	bottom: 0;
	width: 240px;
	height: 160px;
	border-color: blueviolet;
}
.separa03 .circle4 {
	top: initial;
	bottom: 0;
	width: 180px;
	height: 160px;
	border-color: deeppink;
}
.separa04 {
    width: 300px;
    height: 200px;
	/* f=min(L宽度/S宽度，L高度/S高度)，L为容器宽高，S为半径之和， */
	/* 1 / (0.9 + 0.7), 1  =>  1/1.6  */
	--border-radio: 1 / (0.9 + 0.7);
    border-radius: 90% 70% 70% 30% / 30% 30% 70% 70%;
	position: relative;
}
.separa04 .circle1 {
	width: calc(var(--border-radio) * 540px);
	height: calc(var(--border-radio) * 120px);
}
.separa04 .circle2 {
	left: initial;
	right: 0;
	width: calc(var(--border-radio) * 420px);
	height: calc(var(--border-radio) * 120px);
}
.separa04 .circle3 {
	left: initial;
	right: 0;
	top: initial;
	bottom: 0;
	width: calc(var(--border-radio) * 420px);
	height: calc(var(--border-radio) * 280px);
}
.separa04 .circle4 {
	top: initial;
	bottom: 0;
	width: calc(var(--border-radio) * 180px);
	height: calc(var(--border-radio) * 280px);
}
.separa041 {
	width: 300px;
	height: 200px;
	position: relative;
	border-radius: 900px 0 0 0 / 900px 0 0 0;
}
.separa041 .circle1 {
	width: 200px;
	height: 200px;
	border-radius: 0;
	border-top-left-radius: 100%;
	border-right: none;
	border-bottom: none;
	border-color: #e8f3ff;
}
.separa042 {
	width: 300px;
	height: 200px;
	position: relative;
	border-radius: 900px 600px 0 0 / 900px 600px 0 0;
	--border-radio: min(300 / (900 + 600), 200 / 900, 200 / 600);
	/* --border-radio: 300 / (900 + 600); */
}
.separa042 .circle1 {
	width: calc(900px * var(--border-radio));
	height: calc(900px * var(--border-radio));
	border-radius: 0;
	border-top-left-radius: 100%;
	border-right: none;
	border-bottom: none;
	border-color: #e8f3ff;
}
.separa042 .circle2 {
	width: calc(600px * var(--border-radio));
	height: calc(600px * var(--border-radio));
	left: initial;
	right: 0;
	border-radius: 0;
	border-top-right-radius: 100%;
	border-left: none;
	border-bottom: none;
	border-color: #e8f3ff;
}
.separa05 {
	--border-width-left: 50px;
	--border-width-top: 50px;
	--border-width-right: 50px;
	--border-width-bottom: 50px;
	--border-left-top-radius-v: 50px;
	--border-left-top-radius-h: 50px;
	--border-right-top-radius-v: 50px;
	--border-right-top-radius-h: 50px;
	--border-right-bottom-radius-v: 50px;
	--border-right-bottom-radius-h: 50px;
	--border-left-bottom-radius-v: 50px;
	--border-left-bottom-radius-h: 50px;
	border-top: var(--border-width-top) solid cadetblue;
	border-right: var(--border-width-right) solid blueviolet;
	border-bottom: var(--border-width-bottom) solid darkcyan;
	border-left: var(--border-width-left) solid rebeccapurple;
	background: transparent;
    width: 100px;
    height: 100px;
	margin: 20px auto;
    border-radius: var(--border-left-top-radius-v) var(--border-right-top-radius-v) var(--border-right-bottom-radius-v) var(--border-left-bottom-radius-v) / var(--border-left-top-radius-h) var(--border-right-top-radius-h) var(--border-right-bottom-radius-h) var(--border-left-bottom-radius-h);
}
.separa05 .circle1 {
	left: calc(-1 * var(--border-width-left));
	top: calc(-1 * var(--border-width-top));
	width: calc(var(--border-left-top-radius-v) * 2);
	height: calc(var(--border-left-top-radius-h) * 2);
}
.separa05 .circle2 {
	left: 0;
	top: 0;
	width: calc((var(--border-left-top-radius-v) - var(--border-width-left)) * 2);
	height: calc((var(--border-left-top-radius-h) - var(--border-width-top)) * 2);
}
.slider-wrap {
	width: 200px;
	margin-left: 20px;
}

.rect-example {
    width: 300px;
    height: 200px;
    border-radius: 60px;
}
.rect-example .inner {
	position: absolute;
	width: 60px;
	height: 60px;
	border: 2px dashed #000;
	font-size: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.rect-example .inner1 {
	border-bottom: transparent;
	border-right: transparent;
	border-top-left-radius: 60px;
	left: 0;
	top: 0;
}
.rect-example .inner2 {
	border-bottom: transparent;
	border-left: transparent;
	border-top-right-radius: 60px;
	right: 0;
	top: 0;
}
.rect-example .inner3 {
	border-top: transparent;
	border-left: transparent;
	border-bottom-right-radius: 60px;
	right: 0;
	bottom: 0;
}
.rect-example .inner4 {
	border-top: transparent;
	border-right: transparent;
	border-bottom-left-radius: 60px;
	left: 0;
	bottom: 0;
}
</style>
