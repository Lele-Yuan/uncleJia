<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <slot></slot>
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
