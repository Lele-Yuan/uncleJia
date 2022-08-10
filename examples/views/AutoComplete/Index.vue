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
    <el-form inline class="section example-01">
        <el-form-item label="FLEXSEARCH WORKER:">
            <el-input class="el-input-inline" size="mini" v-model="flexsearchWorkerState.inputValue" @blur="showThisDownShift('')" @focus="showThisDownShift('flexsearchWorkerState')" @keyup="searchFlexsearchWorker"></el-input>
            <div class="tips">search title and url by words</div>
            <downshift v-if="flexsearchWorkerState.showDownShift && flexsearchWorkerState.inputValue.trim()" :searchItems="flexsearchWorkerState.searchItems" :q="flexsearchWorkerState.inputValue"></downshift>
        </el-form-item>
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
import { filterQuery, flexsearchQuery, flexsearchQueryWork, flexsearchQueryDocument, lodashDebounce, testTimeout } from './util.ts';
import { searchItem } from './type'
import downshift from './downshift.vue';
import Worker from './index.worker.js';

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
const flexsearchWorkerState = ref({
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
const searchFlexsearchIndex = () => {
    lodashDebounce(()=>{
        console.time('searchFlexsearchIndex');
        flexsearchIndexState.value.searchItems = flexsearchQuery(dataList, flexsearchIndexState.value.inputValue);
        // testTimeout();
        console.timeEnd('searchFlexsearchIndex');
    })()
}

const searchFlexsearchWorker = () => {
    lodashDebounce(()=>{
        console.time('searchFlexsearchWorker');
        flexsearchQueryWork(dataList, flexsearchWorkerState.value.inputValue).then((result: any) => {
            flexsearchWorkerState.value.searchItems = result
            console.timeEnd('searchFlexsearchWorker');
        });
        // testTimeout();
    })()
}
const searchFlexsearchDocument = () => {
    lodashDebounce(()=>{
        console.time('searchFlexsearchDocument');
        flexsearchQueryDocument(dataList, flexsearchDocumentState.value.inputValue).then((result: any) => {
            flexsearchDocumentState.value.searchItems = result
        });
        console.timeEnd('searchFlexsearchDocument');
    })()
}

const showThisDownShift = (downName:string) => {
    ['downshiftState', 'flexsearchIndexState', 'flexsearchWorkerState', 'flexsearchDocumentState'].forEach(downshiftItem => {
        eval(downshiftItem).value.showDownShift = false;
    })

    downName && (eval(downName).value.showDownShift = true);
}

// const workerFun = addEventListener('message', event => {
//     console.log(event.data);
//     console.log(self.name);
//     postMessage('echo');
// })

const testWorker = () => {
    // (self as any).name = 10;
    // const script = "onmessage=" + workerFun.toString();
    // const blob = new Blob([script], { "type": "text/javascript" })
    // const url = URL.createObjectURL(blob)
    // const worker = new Worker(url, {name: 'worker.js'})
    // worker.onmessage = (event: any) => console.log(event.data)
    // worker.postMessage('main thread')
    // setTimeout(()=>{
    //     worker.terminate()
    //     URL.revokeObjectURL(url) // 必须手动释放资源，否则需要刷新Browser Context时才会被释放。
    // }, 1000)

    let worker = new Worker()
    worker.postMessage({
        method: 'transferLang'
    })
    worker.onmessage = function (e) {
        console.log(e.data)
    }
}

testWorker();

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
