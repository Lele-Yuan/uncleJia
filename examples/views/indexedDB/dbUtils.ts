type TiIndexName = string;
type TKeyPath = string;
type TIndex = [TiIndexName, TKeyPath];

interface IOptions {
    version: number; // 版本
    dbName: string; // 数据库的名字
    tables: IObjectStore[]; // 数据对象列表
}
interface IObjectStore {
    name: string;
    primaryKey: string;
    indexs: TIndex[];
}

export enum STATUS {
    start,
    processing,
    reopen,
    complete,
}

export interface IJob {
    id: string;
    title: string;
    state: STATUS;
    createTime: string;
    updateTime?: string;
}

export default class IndexedDbUtils {
    dbName: string = '';
    version: number = 1;
    tables: IObjectStore[] = [];
    dbIstance: IDBDatabase | null = null;
    dbOpeningPromise: Promise<IDBDatabase | Error> | null | undefined;

    constructor({ dbName, version = 1, tables = [] }: IOptions) {
        this.dbName = dbName;
        this.version = version;
        this.tables = tables;
        this.init();
    }

    /**
     * 
     * @returns 
     */
    init() {
        this.dbOpeningPromise = new Promise ((resolve, reject) => {
            const {dbName, version} = this;
            // 判断浏览器是否支持indexedDB
            if (!indexedDB) {
                const errorMsg = '您的浏览器不支持当前内容';
                console.log(errorMsg);
                reject(new Error(errorMsg));
            }
    
            // 判断数据库名称是否为空
            if (!dbName) {
                const errorMsg = '数据库名称不能为空';
                console.log(errorMsg);
                reject(new Error(errorMsg));
            }
    
            const DBOpenRequest = window.indexedDB.open(dbName, version);
            
            DBOpenRequest.onsuccess = () => {
                this.dbIstance = DBOpenRequest.result; // 数据库对象
                console.log('数据库打开成功');
                resolve(this.dbIstance);
            };
    
            DBOpenRequest.onerror = error => {
                console.log('数据库打开失败');
                reject(error);
            };
    
            // 首次创建或者版本变更（更高版本）
            DBOpenRequest.onupgradeneeded = event => {
                // 缓存数据库实例
                this.dbIstance = DBOpenRequest.result;
                console.log('数据库新建或版本升级中');
                console.log('旧版本为：', event.oldVersion);
    
                this.dbIstance.onerror = event => console.log('数据库打开失败', event);
    
                this.dbIstance.onversionchange = () => console.log('数据库版本变更');
    
                this.createTable(this.tables);
                
            }
        })
    }
    
    /**
     * 创建数据对象
     * @param tables 
     */
    createTable(tables: IObjectStore[]) {
        tables.forEach(table => {
            // 当前要创建的表格是否存在时再创建
            if (this.dbIstance && !this.dbIstance.objectStoreNames.contains(table.name)) {
                const objectStore = this.dbIstance.createObjectStore(table.name, {
                    keyPath: table.primaryKey,
                    autoIncrement: !table.primaryKey, // 未指定keyPath时则制定为autoIncrement
                });
                this.createIndex(objectStore, table.indexs);
            }
        })
    }

    /**
     * 创建索引
     * @param objectStore 数据对象
     * @param index {indexName: string, keyPath: string}[]
     */
    createIndex(objectStore: IDBObjectStore, index: TIndex[]) {
        index.forEach(index => {
            objectStore.createIndex(...index);
        })
    }

    openTransaction(objectStoreName: string, mode = 'readonly') {
        const transaction = (this.dbIstance as IDBDatabase).transaction([objectStoreName], mode as IDBTransactionMode);

        transaction.onerror = ((err) => {
            console.log('数据库事务错误', err);
        })

        transaction.oncomplete = (() => {
            console.log('数据库事务完成');
        })
        return transaction.objectStore(objectStoreName);
    }

    /**
     * 
     * @param objectStoreName 对象存储名称
     * @param data 插入的数据：单个对象或数组
     * @returns 
     */
    add(objectStoreName: string, data: object | object[]) {
        const objectStore = this.openTransaction(objectStoreName, 'readwrite');
        if (Array.isArray(data)) {
            data.forEach(item => {
                this.addData(objectStore, item);
            })
        } else {
            this.addData(objectStore, data);
        }
    }

    addData(objectStore: IDBObjectStore, data: object) {
        const request = objectStore.add(data);
        request.onsuccess = () => {
            console.log('数据插入成功', data);
        };
        request.onerror = event => {
            console.log('数据插入失败', event);
        };
    }

    getAllData(objectStoreName: string): Promise<any[]> {
        const request = this.openTransaction(objectStoreName).getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('获取全部数据成功');
                resolve(request.result);
            };
            request.onerror = event => {
                console.log('获取全部数据失败', event);
                reject(event);
            };
        })
    }
}
