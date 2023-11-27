<template>
    <div class="container">
        <el-input
            v-model="todo"
            size="mini"
            placeholder="请输入待办事项，回车确认"
            @keydown.enter="handleEnter"
        />
        <div class="jobs" v-for="job in historyJobs" :key="job.id">
            <el-checkbox size="mini">{{ job.title }}</el-checkbox>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Ref, ref } from "vue";
import IndexedDbUtils, { IJob, STATUS } from "./dbUtils";

const dbRequest = new IndexedDbUtils({
    dbName: 'uncleJia',
    version: 1,
    tables: [{
        name: 'jobs',
        primaryKey: 'id',
        indexs: [
            // ['status', 'status'],
            // ['tag', 'tag'],
        ]
    }],
});

const todo = ref('');
const handleEnter = (event: any) => {
    dbRequest.add('jobs', {
        id: new Date().getTime().toString(),
        title: event.target.value,
        state: STATUS.start,
        createTime: new Date().toLocaleString(),
    } as IJob);

    // getAllJobs();
}

let historyJobs: Ref<IJob[]> = ref([]);
const getAllJobs = async () => {
    const result = await dbRequest.getAllData('jobs');
    if (result) {
        historyJobs.value = result as IJob[];
    }
    console.log('historyJobs: ', historyJobs);
}
dbRequest.dbOpeningPromise?.then(() => {
    getAllJobs();
})
</script>

<style lang="less" scoped>
.container {
    max-width: 960px;
    margin: auto;
    padding: 16px;
    text-align: left;
}

.jobs {
    margin-top: 10px;
}
</style>
