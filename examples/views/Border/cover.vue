<template>
<div class="container">
    <!-- <div class="radius">
        border-radius
    </div>
    <div class="image">
        border-image
    </div> -->
    <div style="font-size: 50px;">CSS</div>
    <div class="text">
        <div>{ border-radius }</div>
        <div>{ border-image }</div>
    </div>
</div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
.container {
    background: #fff;
    padding: 100px 0;
    display: flex;
    justify-content: center;
    background: linear-gradient(-90deg, #019acc 0%, #8793ff 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}
.container * {
    font-size: 40px;
    font-family: monospace;
    color: #fff;
    opacity: .9;
    line-height: 52px;
}
.text {
    text-align: left;
    margin-left: 30px;
}
.radius {
    width: 300px;
    height: 300px;
    margin-right: 30px;
    /* background: linear-gradient(-90deg, #019acc 0%, #8793ff 100%); */
    background: #019acc;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}
.image {
    width: 300px;
    height: 300px;
    border-image-source: url('./border-image.png');
    border-image-slice: 12 34 27 26 fill;
    border-image-width: 12px 34px 27px 26px;
    border-image-outset: 0px 0px 0px 0px;
    border-image-repeat: round;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 8px 16px 27px 16px;
}
</style>
