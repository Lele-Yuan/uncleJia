export interface SheetInfo {
    sheetName: string;
    sheet: Array<string>;
    json: Array<string>;
}
export interface SheetJsonData {
    jsonDatas: BINet.ObjectKeys[];
    sheetName: string;
};

export interface ObjectKeys {
    [key: string]: any;
}