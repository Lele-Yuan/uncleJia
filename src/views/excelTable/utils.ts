/**
 * @description 工具
 * */
import { SheetInfo, SheetJsonData } from './types';
import XLSX from 'xlsx';
import { useStore } from 'vuex';
 
// 读取excel文件
export function readExcel(file: File): Promise<SheetInfo[]> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = e.target.result;
            const wb = XLSX.read(data, { type: 'binary' });
            const result: Array<SheetInfo> = [];
            wb.SheetNames.forEach(sheetName => {
                result.push({
                    sheetName,
                    sheet: XLSX.utils.sheet_to_formulae(wb.Sheets[sheetName]),
                    json: XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
                });
            });
            resolve(result);
        };
        reader.readAsBinaryString(file);
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

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
export function sheet2blob(sheetDatas: SheetJsonData[]) {
	var workbook: any = {
		SheetNames: [],
		Sheets: {}
	};
    sheetDatas.forEach(sheetData => {
        workbook.SheetNames.push(sheetData.sheetName);
        workbook.Sheets[sheetData.sheetName] = XLSX.utils.json_to_sheet(sheetData.jsonDatas);
    });

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

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
 export function downloadDialog(sheetDatas: SheetJsonData[], saveName: string = '导出.xlsx')
 {
    let url: any = sheet2blob(sheetDatas);
    
    if(typeof url == 'object' && url instanceof Blob)
    {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}


export const fileTypes = {
    template: {
        module: [{
            sheetName: '创建员工账号',
            headers: ['*账号类型', '*lastname姓拼音或英文', '*firstname名拼音或英文', '*所属公司', '*姓名', '*区号', '*手机号', '*身份证号'],
            titleMap: {
                A: 'userTypeName',
                B: 'lastName',
                C: 'firstName',
                D: 'companyName',
                E: 'name',
                F: 'areaId',
                G: 'tel',
                H: 'idCardNumber'
            }
        }, {
            sheetName: '创建服务账号',
            headers: ['*账号类型', '*账号名称或邮箱前缀（拼音或英文）', '*所属公司', '*负责人邮箱', '*用途'],
            titleMap: {
                A: 'userTypeName',
                B: 'spellName',
                C: 'companyName',
                D: 'directorEmail',
                E: 'accountDesc'
            }
        }],
        dialogTitle: '批量导入账号',
        tips: '本功能只针对非百度ERP管理的生态公司账号创建',
        api: 'funImportAccount',
        paramsKey: '',
        downloadFile: 'batchImportUser',
        logType: 'createAccount'
    }
};
