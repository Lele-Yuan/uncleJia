<template>
    <div class="import-file">
        <div class="header-title">excel上传预览并下载</div>
        <div v-if="uploadInfo.text" class="warn-info text-ellipsis" :class="uploadInfo.type">{{uploadInfo.text}}</div>
        <div class="upload mt-16">
            <el-button type="text" @click="downloadFile">模板下载</el-button>
            <el-upload :disabled="uploadInfo.disUpload" action="/" accept=".xls,.xlsx" :http-request="uploadSuccess" :show-file-list="false">
                <el-button size="mini" type="primary" class="upload-button" :disabled="uploadInfo.disUpload">文件上传</el-button>
            </el-upload>
            <span class="file-list" v-if="uploadInfo.type === 'success'">{{uploadInfo.fileName}}</span>
        </div>
        <div class="result-table">
            <div v-for="(item, index) in tableau" :key="index" v-html="item"></div>
        </div>

        <div class="header-title" style="margin-top: 50px;">体重统计报表</div>
        <div>
            <div class="his-log-warn" v-if="weightTable.isLoading">加载中......</div>
            <div class="his-log" v-else-if="weightTable.dataList.length">
                <div class="label-text">导入完成数据</div>
            </div>
            <div v-else-if="weightTable.text" class="warn-info text-ellipsis" :class="weightTable.type"><span class="tips ml-8">{{weightTable.text}}</span></div>
        </div>
        <div class="upload mt-16">
            <el-button type="text" @click="downloadWeightFile">模板下载</el-button>
            <el-upload :disabled="weightTable.disUpload" action="/" accept=".xls,.xlsx" :http-request="uploadWeightFile" :show-file-list="false">
                <el-button size="mini" type="primary" class="upload-button" :disabled="weightTable.disUpload">文件上传</el-button>
            </el-upload>
            <span class="file-list" v-if="uploadInfo.type === 'success'">{{weightTable.fileName}}</span>
        </div>
        <div id="weightLine"></div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { readExcel, downloadDialog, downloadWeight, loading } from './utils';
import { ObjectKeys, SheetJsonData, SheetInfo } from './types';
import { dataList } from '../AutoComplete/dataList';
import * as echarts from 'echarts';

export default defineComponent({
    name: 'ImportFile',
    emits: ['uploadSuccess'],
    props: {
        logInfos: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    setup(props) {
        const state = reactive({
            importTime: '',
            uploadInfo: {
                disUpload: false,
                type: '',
                text: '',
                fileName: ''
            },
            tableau: [] as string[],
            weightTable: {
                disUpload: false,
                loading: true,
                type: '',
                text: '',
                fileName: '',
                dataList: []
            }
        });
        let sheetJsonData: SheetJsonData[] = reactive([]);
        const uploadSuccess = (params: { file: File }) => {
            const file = params.file;
            const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                state.uploadInfo.type = 'warn';
                state.uploadInfo.text = '请按照指定模板格式上传';
            } else {
                readExcel(file).then(sheets => {
                    let hasVale2Key = false;
                    const valueKey = sheets[sheets.length-1];
                    hasVale2Key = valueKey.sheetName === '字段对应';
                    hasVale2Key && (sheets.length = sheets.length -1);
                    if (sheets && sheets.length) {
                        if (!sheets[0].sheet_to_formulae.length) {
                            state.uploadInfo.type = 'warn';
                            state.uploadInfo.text = 'excel不能为空';
                            return false;
                        }
                        // 最后一个sheet页需存放keyValue对应关系
                        const hasDisValid = hasVale2Key && sheets.some(tabItem => {
                            return Object.keys(tabItem.sheet_to_json[0]).some(valueItem => {
                                return !valueKey.sheet_to_json.find((keyItem: any) => {
                                    return keyItem.value === valueItem
                                })
                            })
                        })
                        if (hasDisValid) {
                            state.uploadInfo.type = 'warn';
                            state.uploadInfo.text = '请按照指定模板格式上传';
                            // return false;
                        }
                        state.uploadInfo.disUpload = true;
                        upload({
                            sheets: sheets,
                            fileName: file.name
                        });
                    }
                });
            }
        };
        const upload = (params: { sheets: SheetInfo[]; fileName: string;}) => {
            const sheetList = params.sheets;
            const sheetJson: SheetJsonData[] = [];
            
            sheetList.forEach((sheet, index) => {
                state.tableau.push(sheet.sheet_to_html);
                sheetJson[index] = {
                    sheetName: sheet.sheetName,
                    // jsonDatas: sheet.sheet_to_csv
                    jsonDatas: sheet.sheet_to_json
                };
            });
            if (sheetJson.every(i => i.jsonDatas.length > 0)) {
                state.uploadInfo.type = 'info';
                state.uploadInfo.text = '异步执行中...';
                state.uploadInfo.fileName = params.fileName
                console.log(sheetJson);
                sheetJsonData = sheetJson;
                state.uploadInfo.type = 'success';
                state.uploadInfo.text = '导入成功，可在下方根据日期查询详细结果';

                setTimeout(() => {
                    state.uploadInfo.disUpload = false;
                }, 100);
            } else {
                state.uploadInfo.type = 'warn';
                state.uploadInfo.text = 'excel不能为空';
                state.uploadInfo.disUpload = false;
            }
        }
        const downloadFile = () => {
            downloadDialog();
        };
        const downloadWeightFile = () => {
            downloadWeight();
        };

        const weightDataFormat = (sheetHeaders: SheetInfo[]) => {
            const data = {'日期': [], '体重': []} as {'日期': any, '体重': any};
            const hasDisValid = sheetHeaders.some((item, index) => 
                item.sheet_to_json.some((it: any, ind: number) => 
                    Object.keys(data).some((header: string) => {
                        if(it[header]) {
                            data[header as ('日期' | '体重')].push(it[header]);
                        }
                        return !it[header]
                    })
                )
            );
            return hasDisValid ? false : data;
        };
        const initEchart = (dataFormat: {'日期': any, '体重': any}) => {
            var myChart = echarts.init(document.getElementById('weightLine') as HTMLElement, {}, {
                width: 600, height: 300
            });
            // 绘制图表
            myChart.setOption({
                title: {
                    text: '体重统计'
                },
                tooltip: {},
                xAxis: {
                    data: dataFormat['日期']
                },
                yAxis: {},
                series: [{
                    name: '体重',
                    type: 'line',
                    data: dataFormat['体重']
                }]
            });
        };
        const uploadWeightFile = (params: { file: File }) => {
            const file = params.file;
            const fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
            if (fileType !== 'xls' && fileType !== 'xlsx') {
                state.weightTable.type = 'warn';
                state.weightTable.text = '请按照指定模板格式上传';
            } else {
                loading();
                readExcel(file).then(sheets => {
                    if (sheets && sheets.length) {
                        if (!sheets[0].sheet_to_formulae.length) {
                            state.weightTable.type = 'warn';
                            state.weightTable.text = 'excel不能为空';
                            loading(false);
                            return false;
                        }
                        state.weightTable.type = 'info';
                        state.weightTable.text = '异步执行中...';
                        state.weightTable.fileName = file.name;
                        const dataFormat = weightDataFormat(sheets);
                        if (!dataFormat) {
                            state.weightTable.type = 'warn';
                            state.weightTable.text = '请按照指定模板格式上传';
                            loading(false);
                            return false;
                        }
                        console.log(dataFormat);
                        initEchart(dataFormat);
                        setTimeout(() => {
                            state.weightTable.type = 'success';
                            state.weightTable.text = '导入成功，可在下方根据日期查询详细结果';
                            state.weightTable.disUpload = true;
                            loading(false);
                        }, 1000);
                    }
                })
            }
        };
        return {
            ...toRefs(state),
            sheetJsonData,
            uploadSuccess,
            downloadFile,
            downloadWeightFile,
            uploadWeightFile
        };
    }
});
</script>
<style lang="less">
.import-file{
    width: 600px;
    margin: auto;
    padding-bottom: 50px;
    text-align: center;
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
        display: flex;
        justify-content: center;
        align-items: center;
        .upload-button {
            margin: 0 25px;
        }
        .file-list {
            color: @font-content-color;
            font-size: @font-size-normal;
            cursor: pointer;
            i {
                color: #2EA25B;
            }
        }
    }
    .download, .download>*{
        color: @primary-blue-color;
        cursor: pointer;
        font-size: @font-size-normal;
        text-decoration: underline;
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
table {
    border-collapse: collapse;
    margin: 20px auto;
    td {
        border: 1px solid #333;
    }
}
</style>
