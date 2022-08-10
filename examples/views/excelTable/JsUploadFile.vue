<template>
<div class="upload-wrap">
    <div class="header-title">原生JS选择图片并预览</div>
    <el-button type="text" @click="uploadFile">原生JS选择文件</el-button>
    <el-button type="text" @click="saveFile">原生JS保存TXT文件</el-button>
    <div v-if="imgSrcList.lenght > 0">共选择{{imgSrcList.lenght}}张图片</div>
    <div class="img-wrap">
        <img v-for="img in imgSrcList" :key="img" :src="img" alt="">
    </div>
</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { loading } from './utils';
const filePickerOptions = {
    types: [{
        description: '只允许上传图片文件',
        accept: {
            // "text/plain": [".txt"],
            // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            // 'application/vnd.ms-excel': ['.xls'],
            'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
        }
    }],
    multiple: true, // 是否允许上传多个文件,
    excludeAcceptAllOption: true // 是否排除允许全部类型选项
};

const imgSrcList = reactive([] as string[]);
const uploadFile = async () => {
    try {
        loading();
        const fileHandleList = await window.showOpenFilePicker(filePickerOptions);
        fileHandleList.forEach(async (fileHandle: any) => {
            console.log(fileHandle);
            const file = await fileHandle.getFile();
            const buffer = await file.arrayBuffer();
            const url = URL.createObjectURL(new Blob([buffer]));
            imgSrcList.push(url);
        });
        loading(false);
    } catch (error) {
        window.$message.error('该浏览器不支持showOpenFilePicker方法，请切换浏览器');
        loading(false);
    }
};

const saveFile = async () => {
    const FileSystemFileHandle = await window.showSaveFilePicker({ types: [{
            description: '只允许保存txt格式文件',
            accept: {
                "text/plain": [".txt"],
            }
        }]
    });
    const w = await FileSystemFileHandle.createWritable();
    await w.write('new data');
    await w.close();
};
</script>

<style lang="less" scoped>
.upload-wrap {
    margin-bottom: 50px;
}
.img-wrap {
    display: flex;
    width: 1000px;
    margin: auto;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 20px;
    img {
        display: block;
        width: 300px;
        margin-bottom: 10px;
    }
}
</style>
