<template>
  <div class="home">
    <img class="home-logo" alt="Vue logo" src="../assets/logo.svg">
    <div style="position: relative;">
      <defineProps msg></defineProps>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" >HelloWorld</HelloWorld>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import defineProps from '@/components/defineProps.vue';

</script>
<style lang="less">
.home{
  .home-logo{
    width: 100px;
  }
}
</style>
