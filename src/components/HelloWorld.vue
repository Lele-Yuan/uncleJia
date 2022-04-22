<template>
  <div class="hello">
    <h3>Tool websit</h3>
    <ul>
      <li><a href="https://www.ilovepdf.com/zh-cn" target="_blank" >PDF</a></li>
      <li><a href="https://lab.magiconch.com/" target="_blank" >一个有趣的博客</a></li>
      <li><a href="https://lishaoy.net/" target="_blank" >好看的个人博客</a></li>
    </ul>

    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  msg: String,
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
