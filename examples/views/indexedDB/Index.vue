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
        <div class="btn-group">
            <el-button size="mini" type="warning" @click="handleClearJobs">清空全部任务</el-button>
            <el-button size="mini" type="danger" @click="handleDeleteTable">删除数据库</el-button>
        </div>
        <el-input
            v-model="todo"
            size="mini"
            placeholder="请输入待办事项，回车确认"
            @keydown.enter="handleAddJob"
        />
        <div v-for="(item, index) in [todayJobs, historyJobs]" :key="index">
            <div v-if="item.length > 0" class="day-title">
                <span>{{ index === 0 ? '今日任务' : '历史任务' }}</span>
            </div>
            <div class="btn-group" v-if="item.length > 0 && index === 1">
                <el-button size="mini" plain @click="handleCompleteHistory">完成历史任务</el-button>
            </div>
            <div class="jobs" v-for="job in item" :key="job.id">
                <el-checkbox
                    size="mini"
                    :id="job.id"
                    v-model="job.state"
                    :true-label="STATUS.complete"
                    :checked="job.state === STATUS.complete"
                    :indeterminate="job.state === STATUS.reopen"
                    @change="value => handleCompleteJob(value, job)"
                />
                <el-input
                    v-if="editJob.id === job.id"
                    class="title"
                    v-model="editJob.title"
                    size="mini"
                    placeholder="请输入待办事项，回车确认"
                    @keydown.enter="() => handleChangeJob(job)"
                />
                <span class="item" :class="job.state === STATUS.complete && 'complete'" v-else :for="job.id">
                    <div
                        class="title"
                        @dblclick="() => handleEditJob(job)"
                    >
                        <el-dropdown trigger="contextmenu" style="margin-right: 30px">
                            <span class="el-dropdown-link">{{ job.title }}</span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="() => handleEditJob(job)">修改</el-dropdown-item>
                                    <el-dropdown-item v-if="job.state !== STATUS.complete" @click="handleCompleteJob(true, job)">完成</el-dropdown-item>
                                    <el-dropdown-item v-if="job.state === STATUS.complete" @click="handleCompleteJob(false, job)">重新打开</el-dropdown-item>
                                    <el-dropdown-item divided @click="() => handleDeleteJob(job)">删除</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="time">{{ dayjs(job.createTime).format('YYYY-MM-DD hh:mm:ss') }}</div>
                </span>
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
import dayjs from "dayjs";
import IndexedDbUtils, { IJob, STATUS } from "./dbUtils";

const dbRequest = new IndexedDbUtils({
    dbName: 'uncleJia',
    version: 1,
    tables: [{
        name: 'jobs',
        primaryKey: 'id',
        indexs: [
            // ['status', 'status'],
            ['createTime', 'createTime'],
        ]
    }],
});

const todo = ref('');
const handleDeleteTable = async () => {
    const result = await dbRequest.deleteDB();
    if (result) {
        historyJobs.value = [];
    }
}
const handleClearJobs = async () => {
    const result = await dbRequest.clear('jobs');
    if (result) {
        getAllJobs();
    }
}
const handleCompleteHistory = async () => {
    const today = dayjs().format('YYYY-MM-DD 00:00:00');
    const result = await dbRequest.putByIndex(
        'jobs',
        'createTime',
        [new Date('2022-01-01').getTime(), new Date(today).getTime()],
        // 1701418747360,
        {state: STATUS.complete}
    );
    if (result) {
        getAllJobs();
    }
}
const handleCompleteJob = async (value: boolean, job: IJob) => {
    const state = value ? STATUS.complete : STATUS.reopen;
    console.log('state: ', state);
    const result = await dbRequest.put('jobs', {
        ...job,
        state,
    })

    if (result) {
        getAllJobs();
    }
}
const handleAddJob = async () => {
    if (!todo.value) {
        window.$message({
            type: 'error',
            message: '请输入待办事项',
        })
        return;
    }
    const createTime = new Date().getTime();
    const result = await dbRequest.add('jobs', {
        id: createTime.toString(),
        // id: "1701085558270",
        title: todo.value,
        state: STATUS.start,
        createTime,
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
        // createTime: 1669773600000
    })

    if (result) {
        editJob.id = '';
        editJob.title = '';
        getAllJobs();
    }
};

const handleRepetition = () => {
    const createTime = new Date().getTime();
    const job = {
        id: createTime.toString(),
        title: '测试重复主键',
        state: STATUS.start,
        createTime,
    } as IJob;
    dbRequest.add('jobs', [job, job]);
};

let historyJobs: Ref<IJob[]> = ref([]);
let todayJobs: Ref<IJob[]> = ref([]);
const getAllJobs = async () => {
    dbRequest.getAllData('jobs').then(result => {
        if (result) {
            const totalJobs = result.sort(job => job.createTime);
            todayJobs.value = totalJobs.filter(job => (
                dayjs(job.createTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
            ));
            historyJobs.value = result.filter(job => (
                dayjs(job.createTime).format('YYYY-MM-DD') !== dayjs().format('YYYY-MM-DD')
            ));
            console.log('historyJobs: ', dayjs().format('YYYY-MM-DD'), totalJobs, todayJobs.value, historyJobs.value);
        }
    });
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

    .day-title {
        text-align: center;
        font-weight: bold;
        color: #11141a;
        margin-top: 10px;
        display: flex;
        align-items: center;

        span {
            padding: 0 8px;
        }

        &::before, &::after {
            content: '';
            height: 0;
            border-bottom: 1px dashed #878D99;
            flex: 1;
        }
    }
    
    .btn-group {
        margin-block: 16px;
        text-align: right;
    }
}

.jobs {
    margin-top: 10px;
    display: flex;
    align-items: center;

    .item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &.complete .title :deep(span){
            text-decoration: line-through;
        }

        .title {
            margin-left: 8px;
        }

        .time {
            font-size: 12px;
            color: #878D99;
        }
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
