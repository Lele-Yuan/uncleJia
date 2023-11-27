<template>
    <div class="easy-marker">
        Welcome to my blog!
        you can select the text and click the menu to do something.
    </div>
    <div class="button-wrapper">
        <j-button hoverType="fill" type="warning" plain>JButton fill warning plain</j-button>
        <j-button msg="install button">Jbutton install button</j-button>
        <el-button>ElButton</el-button>
    </div>
</template>
<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import EasyMarker, { MenuItem } from 'easy-marker';

const menuItems = [
  {
    text: '划线笔记',
    id: 1
  },
  {
    text: '分享',
    style: {
      backgroundColor: '#407ff2',
      paddingLeft: '0.5rem'
    },
    id: 2
  },
  {
    text: '复制',
    id: 3
  }
] as unknown as MenuItem[]
const easyMarker = new EasyMarker({ 
  menuTopOffset: '2rem',
  menuItems
});
onMounted(() => {
  const container = document.querySelector('.easy-marker') as HTMLElement;
  easyMarker.create(container);
});
</script>

<style lang="less" scoped>
.easy-marker {
    margin: auto;
    width: 300px;
    padding: 20px;
}

.button-wrapper button{
    display: block;
    margin: 10px auto;
}
</style>
