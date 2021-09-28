<template>
<div class="auto-complete-contianer">
    <div class="section example-01">
        <el-input class="el-input-inline" size="mini" v-model="downshiftState.inputValue" @keyup="searchDownshift"></el-input>
        <downshift v-if="downshiftState.inputValue.trim()" :searchItems="downshiftState.searchItems" :q="downshiftState.inputValue"></downshift>
    </div>
    <div class="section example-01">
        <el-input class="el-input-inline" size="mini" v-model="flexsearchState.inputValue" @keyup="searchFlexsearch"></el-input>
        <downshift v-if="flexsearchState.inputValue.trim()" :searchItems="flexsearchState.searchItems" :q="flexsearchState.inputValue"></downshift>
    </div>
</div>
</template>
<script lang="ts" setup>
import { reactive, Ref, ref } from '@vue/reactivity';
import { dataList } from './autoComplete.js';
import { filterQuery, flexsearchQuery, flexsearchQueryDocument } from './util.ts';
import { searchItem } from './type'
import downshift from './downshift.vue';

components: [
    downshift
]
const dataTotalList = dataList
const downshiftState = ref({
    inputValue: '',
    searchItems: [] as searchItem[] 
});
const flexsearchState = ref({
    inputValue: '',
    searchItems: [] as searchItem[] 
});

const searchDownshift = () => {
    console.time('searchDownshift');
    downshiftState.value.searchItems = filterQuery(dataList, downshiftState.value.inputValue);
    console.timeEnd('searchDownshift');
}
const searchFlexsearch = () => {
    console.time('searchFlexsearch');
    flexsearchState.value.searchItems = flexsearchQueryDocument(dataList, flexsearchState.value.inputValue);
    console.timeEnd('searchFlexsearch');
}

</script>
<style scoped lang="less">
.auto-complete-contianer {
    .example-01 {
        width: 40%;
        display: inline-block;
        text-align: left;
        margin-left: 100px;
        position: relative;
    }
}
</style>
