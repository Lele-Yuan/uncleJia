export interface SheetInfo {
    sheetName: string;
    sheet_to_formulae: Array<string>;
    sheet_to_json: Array<any>;
    sheet_to_csv: string;
    sheet_to_html: string;
}
export interface SheetJsonData {
    jsonDatas: any;
    sheetName: string;
};

export interface ObjectKeys {
    [key: string]: any;
}