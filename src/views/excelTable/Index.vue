<template>
  <div class="about">
    <h1>This is an about page</h1>
    链接
    <a href="https://www.jianshu.com/p/31534691ed53">js-xlsx使用</a>
    <a href="http://demo.haoji.me/2017/02/08-js-xlsx/">JavaScript读取和导出excel示例（基于js-xlsx）</a>
    <a href="https://github.com/rockboom/SheetJS-docs-zh-CN">sheetJS GITHub</a>
    <a href="http://blog.haoji.me/js-excel.html">如何使用JavaScript实现纯前端读取和导出excel文件</a>
  </div>

  <ImportFile></ImportFile>
</template>
<script setup>
import ImportFile from './ImportFile.vue'

props: [
  ImportFile
]
</script>
