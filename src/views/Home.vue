<template>
  <div class="home">
    <img class="home-logo" alt="Vue logo" src="../assets/logo.svg">
    <defineProps msg></defineProps>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import defineProps from '@/components/defineProps.vue';

</script>
<style lang="less">
.home{
  .home-logo{
    width: 200px;
  }
}
</style>
