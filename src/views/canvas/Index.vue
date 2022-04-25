<template>
<el-button type="danger" size="mini" @click="saveScreen" data-html2canvas-ignore>保存页面</el-button>
    <div class="flex">
        <Sign />
        <Ticket class="ticket-wrap" />
        <Clock class="ticket-wrap" />
        <Pie />
    </div>
    <div class="flex">
        <Exercise />
    </div>
</template>
<script lang="ts" setup>
import Ticket from "./Ticket.vue";
import Sign from "./Sign.vue";
import Clock from "./Clock.vue";
import Exercise from './Exercise.vue';
import Pie from './Pie.vue';
import html2canvas from 'html2canvas'
import { onMounted } from "vue-demi";
import { downloadUrl } from "../excelTable/utils";

const saveScreen = () => {
    html2canvas(document.getElementById('app') as HTMLElement).then(function(canvas) {
        const canvasImg = canvas.toDataURL();
        downloadUrl(canvasImg, 'html.png');
    });
};

</script>

<style lang="less" scoped>
.flex {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    :deep canvas {
        border: 1px solid #c2cdf9;
        box-sizing: border-box;
    }
}
.ticket-wrap {
    width: 400px;
    height: 200px;
    margin: 10px;
    position: relative;
}
</style>
