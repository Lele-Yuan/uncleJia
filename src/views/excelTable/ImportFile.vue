<template>
    <div class="import-file">
        <div class="header-tips">
            {{tips}}
        </div>
        <div
            v-if="uploadInfo.text"
            class="warn-info text-ellipsis"
            :class="uploadInfo.type">
            <i
                v-if="uploadInfo.type === 'warn'"
                style="color: #F27C49;"
                class="iconfont icon-warn-icon">
            </i>
            <i
                v-if="uploadInfo.type === 'info'"
                style="color: #4c84FF;"
                class="iconfont icon-info-icon">
            </i>
            <i
                v-if="uploadInfo.type === 'success'"
                style="color: #39BF45;"
                class="el-icon-success">
            </i>
            <span class="tips ml-8">
                {{uploadInfo.text}}
            </span>
        </div>
        <div>
            <span class="label-text" @click="downloadFile">模板下载</span>
            <span class="download">
                <slot></slot>
            </span>
        </div>
        <div class="upload mt-16">
            <div class="upload-content">
                <span class="label-text">{{dialogTitle}}文件导入</span>
                <el-upload
                    :disabled="disUpload"
                    action="/"
                    accept=".xls,.xlsx"
                    :http-request="uploadSuccess"
                    :show-file-list="false"
                >
                    <el-button
                            size="mini"
                            :disabled="disUpload">
                        <i class="iconfont icon-upload-icon"></i>
                        文件上传
                    </el-button>
                </el-upload>
            </div>
            <div class="file-list" v-if="uploadInfo.type === 'success'">
                <i class="iconfont icon-excel"></i>
                {{uploadInfo.fileName}}
            </div>
        </div>
        <div v-if="importTime">
            <div class="his-log-warn" v-if="logInfos.isLoading">
                加载中......
            </div>
            <div class="his-log-warn" v-else-if="!logInfos.list.length">
                暂无内容
            </div>
            <div class="his-log" v-else>
                <div class="label-text">
                    导入完成数据
                </div>
                <div>
                    <div class="log-item-tip">
                        下载完成数据可查看导入情况以及原因
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, watch } from 'vue';
import { readExcel, downloadDialog, fileTypes } from './utils';
import { ObjectKeys, SheetJsonData } from './types';
import XLSX from 'xlsx';

export default defineComponent({
    name: 'ImportFile',
    emits: ['uploadSuccess'],
    props: {
        dialogTitle: {
            type: String,
            default: '标题'
        },
        tips: {
            type: String,
            default: ''
        },
        resultInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        logInfos: {
            type: Object,
            default: () => {
                return {};
            }
        },
        sheetHeaders: {
            type: Array as () => {
                headers: string[];
            }[],
            default: () => {
                return [];
            }
        }
    },
    setup(props) {
        const baseUploadInfo = {
            type: '',
            text: '',
            fileName: ''
        };
        const state = reactive({
            importTime: '',
            disUpload: false,
            uploadInfo: {
                ...baseUploadInfo
            }
        });
        const templateContent: ObjectKeys = fileTypes['template'];
        const sheetJsonData: SheetJsonData[] = reactive([]);
        function disabledDate(time: Date) {
            return time.getTime() > Date.now();
        }
        return {
            ...toRefs(state),
            disabledDate,
            templateContent,
            sheetJsonData
        };
    },
    methods: {
        downloadFile(){
            downloadDialog(this.sheetJsonData)
        },
        uploadSuccess(params: { file: File }) {
            const file = params.file;
            const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                this.uploadInfo.type = 'warn';
                this.uploadInfo.text = '请按照指定模板格式上传';
            } else {
                readExcel(file).then(tab => {
                    if (tab && tab.length) {
                        if (!tab[0].sheet.length) {
                            this.uploadInfo.type = 'warn';
                            this.uploadInfo.text = 'excel不能为空';
                            return false;
                        }
                        const some = this.sheetHeaders.some((item, index) => item.headers.some((it, ind: number) => it !== tab[index].sheet[ind].split('=\'')[1]));
                        if (some) {
                            this.uploadInfo.type = 'warn';
                            this.uploadInfo.text = '请按照指定模板格式上传';
                            return false;
                        }
                        this.disUpload = true;
                        setTimeout(() => {
                            this.disUpload = false;
                        }, 30000);
                        this.upload({
                            tab: tab,
                            fileName: file.name
                        });
                    }
                });
            }
        },
        upload(params: {
            tab: {
                sheetName: string;
                sheet: string[];
            }[];
            fileName: string;
        }) {
            const sheetList = params.tab;
            sheetList.length = this.templateContent.module.length;
            const sheetJsonData: SheetJsonData[] = [];
            sheetList.forEach((it, index) => {
                const jsonDatas: ObjectKeys[] = [];
                it.sheet.forEach(item => {
                    const en = item.split(('='))[0].replace(/[0-9]/ig, '');
                    const num = Number(item.split('=')[0].replace(/[A-Z]/ig, '')) - 1;
                    const data = item.includes('=\'') ? item.split('=\'')[1] : item.split('=')[1];
                    const key = this.templateContent.module[index].titleMap[en];
                    jsonDatas[num] = Object.values(this.templateContent.module[index].titleMap).reduce((pre: any, curr: any) => {
                        return {
                            [curr]: '',
                            ...jsonDatas[num],
                            ...pre,
                            ...(curr === key ? {
                                [key]: data
                            } : {})
                        };
                    }, {}) as ObjectKeys;
                });
                jsonDatas.shift();
                sheetJsonData[index] = {
                    sheetName: it.sheetName,
                    jsonDatas
                };
            });
            if (sheetJsonData.every(i => i.jsonDatas.length > 0)) {
                this.uploadInfo = {
                    type: 'info',
                    text: '异步执行中...',
                    fileName: params.fileName
                };
                console.log(sheetJsonData);
                this.sheetJsonData = sheetJsonData;
                // (this.type === 'account'
                //     ? this.funImportAccount(sheetJsonData, this.accountTypeList)
                //     : this.handelUpload({
                //         [this.templateContent.paramsKey]: sheetJsonData[0].jsonDatas
                //     }, this.templateContent.api)).then(res => {
                //     if (res.status === 200) {
                //         this.uploadInfo = {
                //             type: 'success',
                //             text: '导入成功，可在下方根据日期查询详细结果',
                //             fileName: params.fileName
                //         };
                //     } else {
                //         this.uploadInfo = {
                //             type: 'warn',
                //             text: res.desc ?? `${UNKNOWN_MSG} ${res.status}`,
                //             fileName: params.fileName
                //         };
                //     }
                // });
            } else {
                this.uploadInfo = {
                    type: 'warn',
                    text: 'excel不能为空',
                    fileName: ''
                };
                this.disUpload = false;
            }
        }
    }
});
</script>
<style lang="less">
.import-file{
    width: 300px;
    margin: auto;
    text-align: center;
    .el-dialog__title {
        font-weight: bold;
    }
    .el-dialog__footer .el-button {
        padding: 5px 24px;
    }
    .el-dialog__body .el-button {
        padding: 5px 16px;
    }
    .el-dialog__footer {
        padding-top: 16px;
    }
    .header-tips {
        font-size: @font-size-normal;
        color: @font-subtit-color;
        margin-bottom: 12px;
    }
    .label-text {
        display: inline-block;
        width: 130px;
        text-align: right;
        font-size: @font-size-normal;
        color: @font-subtit-color;
        line-height: 28px;
        margin-right: 16px;
    }
    .warn-info {
        border-radius: @border-radius;
        margin-bottom: 16px;
        padding-left: 16px;
        font-size: @font-size-normal;
        height: 28px;
        line-height: 28px;
        i {
            font-size: @font-size-normal;
        }
    }
    .warn {
        background-color: #FFF7F2;
        border: 1px solid #FFD1B8;
    }
    .success {
        background-color: #F2FFF4;
        border: 1px solid #A5E6AE;
    }
    .info {
        background-color: #F2F5FF;
        border: 1px solid #B8CBFF;
    }
    .tips {
        color: @font-content-color;
        font-size: @font-size-normal;
    }
    .ml-8 {
        margin-left: 8px;
    }
    .upload {
        padding-bottom: 24px;
        .file-list {
            margin-left: 126px;
            margin-top: 10px;
            color: @font-content-color;
            font-size: @font-size-normal;
            cursor: pointer;
            i {
                color: #2EA25B;
            }
        }
    }
    .upload-content {
        display: flex;
        .des-text {
            margin-top: 4px;
            font-size: @font-size-normal;
            color: @font-gray-color;
        }
        .el-upload-list__item-name {
            font-size: @font-size-normal;
            color: @font-content-color;
        }
    }
    .download, .download>*{
        color: @primary-blue-color;
        cursor: pointer;
        font-size: @font-size-normal;
        text-decoration: underline;
    }
    .his-info {
        padding-top: 14px;
        border-top: 1px solid @background-active-color;
        .nav-title {
            font-size: @font-size-normal;
            font-weight: bold;
            padding: 0 0 0 8px;
            position: relative;
            margin: 10px 0;
            color: #000000;
            &::before {
                content: "";
                position: absolute;
                width: 4px;
                height: 12px;
                background: @primary-blue-color;
                left: 0;
                bottom: 2px;
            }
        }
        .el-date-editor {
            width: 182px;
        }
    }
    .his-log-warn {
        margin-top: 20px;
        margin-left: 126px;
        font-size: @font-size-normal;
        color: @font-gray-color
    }
    .his-log {
        display: flex;
        margin-top: 20px;
        .log-item {
            display: flex;
            align-items: center;
            font-size: @font-size-normal;
            color: @font-content-color;
            margin: 4px 0;
            cursor: pointer;
            .excel-icon {
                background: url("./images/excel.svg") no-repeat center;
                width: 16px;
                height: 16px;
                display: inline-block;
                background-size: cover;
                margin-right: 4px;
            }
        }
        .log-item-tip {
            font-size: @font-size-normal;
            color: @font-gray-color
        }
    }
}
</style>
