<template>
    <div class="border-image-section">
        <img src="./border-image.png" alt="" style="display: inline-block; margin: 20px; vertical-align: top;">
        <div class="section01">我是一个长度不确定的气泡对话框</div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
.border-image-section .section01 {
    display: inline-block;
    padding: 8px 16px 27px 16px;
    border-image-source: url('./border-image.png');
    border-image-slice: 12 34 27 26 fill;
    border-image-width: 12px 34px 27px 26px;
    border-image-outset: 0px 0px 0px 0px;
    border-image-repeat: round;
    /* border-image: url('./border-image.png') 8 34 27 34 fill / 8px 34px 27px 34px / 0px round; */
    width: fit-content;
    font-size: 26px;
    color: #fff;
    max-width: 300px;
    word-break: break-all;
    margin: 20px;
    line-height: 40px;
}
</style>
