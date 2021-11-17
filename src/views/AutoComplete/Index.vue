<template>
<div class="auto-complete-contianer">
    <el-form inline class="section example-01">
        <el-form-item label="REGEXSEARCH:">
            <el-input class="el-input-inline" size="mini" v-model="downshiftState.inputValue" @blur="showThisDownShift('')" @focus="showThisDownShift('downshiftState')" @keyup="searchDownshift"></el-input>
            <downshift v-if="downshiftState.showDownShift && downshiftState.inputValue.trim()" :searchItems="downshiftState.searchItems" :q="downshiftState.inputValue"></downshift>
        </el-form-item>
        <el-form-item label="FLEXSEARCH INDEX:">
            <el-input class="el-input-inline" size="mini" v-model="flexsearchIndexState.inputValue" @blur="showThisDownShift('')" @focus="showThisDownShift('flexsearchIndexState')" @keyup="searchFlexsearchIndex"></el-input>
            <div class="tips">search title by per letter</div>
            <downshift v-if="flexsearchIndexState.showDownShift && flexsearchIndexState.inputValue.trim()" :searchItems="flexsearchIndexState.searchItems" :q="flexsearchIndexState.inputValue"></downshift>
        </el-form-item>
    </el-form>
    <el-form class="section example-01">
        <el-form-item label="FLEXSEARCH DOCUMENT:">
            <el-input class="el-input-inline" size="mini" v-model="flexsearchDocumentState.inputValue" @blur="showThisDownShift('')" @focus="showThisDownShift('flexsearchDocumentState')" @keyup="searchFlexsearchDocument"></el-input>
            <div class="tips">search title and url by words</div>
            <downshift v-if="flexsearchDocumentState.showDownShift && flexsearchDocumentState.inputValue.trim()" :searchItems="flexsearchDocumentState.searchItems" :q="flexsearchDocumentState.inputValue"></downshift>
        </el-form-item>
    </el-form>
</div>
</template>
<script lang="ts" setup>
import { reactive, Ref, ref } from '@vue/reactivity';
import { dataList } from './dataList.js';
import { filterQuery, flexsearchQuery, flexsearchQueryDocument, lodashDebounce } from './util.ts';
import { searchItem } from './type'
import downshift from './downshift.vue';

components: [
    downshift
]
const dataTotalList = dataList
const downshiftState = ref({
    showDownShift: false,
    inputValue: '',
    searchItems: [] as searchItem[] 
});
const flexsearchIndexState = ref({
    showDownShift: false,
    inputValue: '',
    searchItems: [] as searchItem[] 
});
const flexsearchDocumentState = ref({
    showDownShift: false,
    inputValue: '',
    searchItems: [] as searchItem[] 
});

const searchDownshift = () => {
    lodashDebounce(()=>{
        console.time('searchDownshift');
        downshiftState.value.searchItems = filterQuery(dataList, downshiftState.value.inputValue);
        console.timeEnd('searchDownshift');
    })()
}
const searchFlexsearchDocument = () => {
    lodashDebounce(()=>{
        console.time('searchFlexsearchDocument');
        flexsearchDocumentState.value.searchItems = flexsearchQueryDocument(dataList, flexsearchDocumentState.value.inputValue);
        console.timeEnd('searchFlexsearchDocument');
    })()
}
const searchFlexsearchIndex = () => {
    lodashDebounce(()=>{
        // console.log('lodashDebounce')
        console.time('searchFlexsearchIndex');
        flexsearchIndexState.value.searchItems = flexsearchQuery(dataList, flexsearchIndexState.value.inputValue);
        console.timeEnd('searchFlexsearchIndex');
    })()
}

const showThisDownShift = (downName:string) => {
    ['downshiftState', 'flexsearchIndexState', 'flexsearchDocumentState'].forEach(downshiftItem => {
        eval(downshiftItem).value.showDownShift = false;
    })

    downName && (eval(downName).value.showDownShift = true);
}

</script>
<style scoped lang="less">
.auto-complete-contianer {
    .example-01 {
        // width: 40%;
        // display: inline-block;
        text-align: left;
        margin-left: 100px;
        position: relative;
    }
    .el-form--inline .el-form-item{
        margin-right: 40px;
    }
}
</style>
