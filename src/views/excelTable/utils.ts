/**
 * @description 工具
 * */
import { SheetInfo, SheetJsonData } from './types';
import XLSX from 'xlsx';
import { useStore } from 'vuex';
function fixdata(data: any) { //文件流转BinaryString
    let o = "", l = 0;
    const w = 10240;
    for (; l < data.byteLength / w; ++l) 
        o += String.fromCharCode.apply(null, [...new Uint8Array(data.slice(l * w, l * w + w))]);
    o += String.fromCharCode.apply(null, [...new Uint8Array((data).slice(l * w))]);
    return o;
}

// 读取excel文件
export function readExcel(file: File): Promise<SheetInfo[]> {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
            const data = fileReader.result;
            // console.log(data);
            // readAsBinaryString
            // const workbook = XLSX.read(data, { type: 'binary' });
            // readAsArrayBuffer
            // const workbook = XLSX.read(data, {type:"buffer"});
            // readAsArrayBuffer buffer -> BinaryString -> base64 
            const workbook = XLSX.read(btoa(fixdata(data)), {type:"base64"});
            // readAsDataURL
            // const workbook = XLSX.read((data as string).split(';')[1].replace('base64,',''), {type:"base64"});
            // console.log(workbook);
            const result: Array<SheetInfo> = [];
            workbook.SheetNames.forEach(sheetName => {
                const sheet_to_html = XLSX.utils.sheet_to_html(workbook.Sheets[sheetName]);
                const sheet_to_csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
                const sheet_to_formulae = XLSX.utils.sheet_to_formulae(workbook.Sheets[sheetName]);
                const sheet_to_json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as Array<string>;
                result.push({
                    sheetName,
                    sheet_to_html,
                    sheet_to_csv,
                    sheet_to_formulae,
                    sheet_to_json
                });
            });
            console.log(result);
            resolve(result);
        };
        // fileReader.readAsBinaryString(file);
        fileReader.readAsArrayBuffer(file);
        // fileReader.readAsDataURL(file);
    });
}

// csv转sheet对象
export function csv2sheet(csv: any) {
	var sheet: any = {}; // 将要生成的sheet
	csv = csv.split('\n');
	csv.forEach(function(row: any, i: number) {
		row = row.split(',');
		if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
		row.forEach(function(col: any, j: number) {
			sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
		});
	});
	return sheet;
}

export function json2sheet(json: any) {
    return XLSX.utils.json_to_sheet(json);
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
// export function sheet2blob(sheetDatas: SheetJsonData[]) {
export function sheet2blob() {
	var workbook: any = {
		SheetNames: [],
		Sheets: {}
	};
    // sheetDatas.forEach(sheetData => {
        const aoa = [['姓名','性别','年龄','注册时间'], ['张三','男','18','9/16/21','22'], ['李四','女','22','9/16/21','26'], ['主要信息','','','其它信息']];
        const csv = `姓名,性别,年龄,注册时间,\n张三,男,18,9/16/21,22\n李四,女,22,9/16/21,26\n主要信息,,,其它信息,`;
        const json = [
            { '姓名': '张三', '年龄': 18, '性别': '男', '注册时间': 44455.62984811343 },
            { '姓名': '李四', '年龄': 22, '性别': '女', '注册时间': 44455.62984811343 },
            { '姓名': '主要信息', '注册时间': '其它信息' },
        ];
        const sheetName = 'sheet1';
        workbook.SheetNames.push(sheetName);
        workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(json);
        // workbook.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(aoa);
        // workbook.Sheets[sheetName] = csv2sheet(csv);
        // workbook.Sheets[sheetName] = XLSX.utils.table_to_sheet(document.getElementsByTagName('table')[0]);
    // });

	return writeXlsx(workbook);
}

function writeXlsx(workbook: any) {
	// 生成excel的配置项
	var wopts: any = {
		bookType: 'xlsx', // 要生成的文件类型
		bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
		type: 'binary'
	};
	var wbout = XLSX.write(workbook, wopts);
	var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
	// 字符串转ArrayBuffer
	function s2ab(s: any) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}

    return blob;
}

export function downloadWeight() {
    var workbook: any = {
		SheetNames: [],
		Sheets: {}
	};
    const json = [
        { '体重': 50, '日期': '2022-02-17'}
    ];
    const sheetName = 'sheet1';
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(json);
    downloadUrl(writeXlsx(workbook), '体重统计模版.xlsx')
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
// export function downloadDialog(sheetDatas: SheetJsonData[], saveName: string = '导出.xlsx') {
export function downloadDialog(sheetDatas?: SheetJsonData[], saveName: string = '导出.xlsx') {
    // let url: any = sheet2blob(sheetDatas);
    let url: any = sheet2blob();
    downloadUrl(url, saveName);
}

export function downloadUrl(url: any, saveName: string) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    let event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

let loadingService = null as any;
export function loading(isShow = true) {
    if (!isShow) {
        loadingService && loadingService.close();
        return;
    }
    loadingService = window.$loading.service({
        lock: true,
        text: '数据加载中...',
        fullscreen: false,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)'
    });
}
