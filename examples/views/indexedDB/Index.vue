<template>
    <div class="remark">
        <div class="title">TODO LIST</div>
        <div class="desc">
            利用浏览器的indexedDB技术实现对数据的存储，以及增删改查操作。
            <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API">文档链接</a><br/>
            在任务上【右键】可以操作，包括修改、删除、完成等；输入框中输入内容，回车确认添加任务。
        </div>
    </div>
    <div class="container">
        <el-input
            v-model="todo"
            size="mini"
            placeholder="请输入待办事项，回车确认"
            @keydown.enter="handleAddJob"
        />
        <div class="jobs" v-for="job in historyJobs" :key="job.id">
            <el-checkbox size="mini"></el-checkbox>
            <el-input
                v-if="editJob.id === job.id"
                class="title"
                v-model="editJob.title"
                size="mini"
                placeholder="请输入待办事项，回车确认"
                @keydown.enter="() => handleChangeJob(job)"
            />
            <div
                v-else
                class="title"
                @dblclick="() => handleEditJob(job)"
            >
                <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 30px">
                    <span class="el-dropdown-link">{{ job.title }}</span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="() => handleEditJob(job)">修改</el-dropdown-item>
                            <el-dropdown-item>完成</el-dropdown-item>
                            <el-dropdown-item>重新打开</el-dropdown-item>
                            <el-dropdown-item divided @click="() => handleDeleteJob(job)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </div>

    <div class="test-wrapper">
        <div class="title">测试区域</div>
        <el-button size="mini" type="primary" @click="handleRepetition">重复主键</el-button>
    </div>
</template>
<script lang="ts" setup>
import { Ref, reactive, ref } from "vue";
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
const handleAddJob = async () => {
    if (!todo.value) {
        window.$message({
            type: 'error',
            message: '请输入待办事项',
        })
        return;
    }
    const result = await dbRequest.add('jobs', {
        id: new Date().getTime().toString(),
        // id: "1701085558270",
        title: todo.value,
        state: STATUS.start,
        createTime: new Date().toLocaleString(),
    } as IJob);

    if (result) {
        todo.value = '';
        getAllJobs();
    }
}

const editJob = reactive({
    id: '',
    title: '',
})
const handleEditJob = (job: IJob) => {
    editJob.id = job.id;
    editJob.title = job.title;
};

const handleDeleteJob = async (job: IJob) => {
    const result = await dbRequest.delete('jobs', job.id);
    if (result) {
        getAllJobs();
    }
}
const handleChangeJob = async (job: IJob) => {
    const result = await dbRequest.put('jobs', {
        ...job,
        title: editJob.title,
    })

    if (result) {
        editJob.id = '';
        editJob.title = '';
        getAllJobs();
    }
};

const handleRepetition = () => {
    const job = {
        id: new Date().getTime().toString(),
        title: '测试重复主键',
        state: STATUS.start,
        createTime: new Date().toLocaleString(),
    } as IJob;
    dbRequest.add('jobs', [job, job]);
};

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
.remark {
    padding: 16px;
    .title {
        font-size: 16px;
    }

    .desc {
        font-size: 12px;
        line-height: 20px;
        color: #878D99;
        margin-top: 10px;

        * {
            font-size: 12px;
        }
    }
}
.container {
    max-width: 960px;
    margin: auto;
    padding: 16px;
    text-align: left;
}

.jobs {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .title {
        margin-left: 8px;
    }
}

.test-wrapper {
    margin: 16px;
    padding: 20px;
    text-align: left;
    border: 1px solid rgba(0,0,0,.06);
    border-radius: 8px;
    box-shadow: inset 0 0px 8px rgba(0, 0, 0, 0.07);
    background: rgba(0, 0, 0, 0.01);
    
    .title {
        font-size: 14px;
        margin-bottom: 20px;
        font-weight: bold;
        color: #11141a;
    }
}
</style>
