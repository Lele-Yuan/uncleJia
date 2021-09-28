<template>
<div class="downshift">
    <div class="search-results" v-if="props.searchItems.length > 0">
        <div class="search-option" v-for="item in props.searchItems" :key="item.title+item.url">
            <b v-html="HighlightMatch({title: item.title, q: props.q})"></b><br>
            <small v-html="HighlightMatch({title: item.url, q: props.q})"></small>
        </div>
    </div>
    <div class="search-empty" v-else>No Document Title Found.</div>
</div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
import { HighlightMatch } from './util';

// expects props options
const props = defineProps({
    q: {
        type: String,
        default: ''
    },
    searchItems: {
      type: Array,
      required: true
    }
})

</script>
<style scoped lang="less">
.downshift {
    position: absolute;
    top: 40px;
    border: 1px solid @border-color-black;
    padding: 10px;
    .search-results{
        height: 325px;
        overflow-y: auto;
    }
    .search-option{
        padding: 10px 0;
        border-bottom: 1px solid @border-color-gray;
        cursor: pointer;
    }
}
</style>
