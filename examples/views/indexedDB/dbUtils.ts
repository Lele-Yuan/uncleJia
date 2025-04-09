type TiIndexName = string;
type TKeyPath = string;
type TIndex = [TiIndexName, TKeyPath];

interface IOptions {
    version: number; // 版本
    dbName: string; // 数据库的名字
    tables?: IObjectStore[]; // 数据对象列表
}
interface IObjectStore {
    name: string;
    primaryKey?: string;
    indexs?: TIndex[];
}

export enum STATE {
    start,
    reopen,
    complete,
}

export interface IJob {
    id: string;
    title: string;
    state: STATE;
    createTime: number;
    updateTime?: number;
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
     * 初始化数据库配置，打开数据库
     * @returns 打开数据库的Promise
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

            const DBOpenRequest = window.indexedDB.open(this.dbName, this.version);
            console.log('open数据库', DBOpenRequest.readyState);
            
            DBOpenRequest.onsuccess = () => {
                this.dbIstance = DBOpenRequest.result; // 数据库对象
                console.log('数据库打开成功', DBOpenRequest.readyState);
                resolve(this.dbIstance);
            };

            DBOpenRequest.onerror = error => {
                console.log('数据库打开失败', DBOpenRequest.readyState);
                reject(error);
            };

            // 首次创建或者版本变更（更高版本）
            DBOpenRequest.onupgradeneeded = event => {
                // 缓存数据库实例
                this.dbIstance = DBOpenRequest.result;
                console.log('数据库新建或版本升级中', DBOpenRequest.readyState);
                console.log('旧版本为：', event.oldVersion);

                this.dbIstance.onerror = event => console.log('数据库打开失败', event);

                this.dbIstance.onversionchange = () => console.log('数据库版本变更');

                this.createTable(this.tables);

                if (event.oldVersion > 0 && event.oldVersion < 2) {
                    this.dbIstance?.deleteObjectStore('test_v1');
                }
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
    createIndex(objectStore: IDBObjectStore, index?: TIndex[]) {
        index?.forEach(index => {
            objectStore.createIndex(...index);
        })
    }

    openTransaction(objectStoreName: string, mode = 'readonly', oncomplete?: () => void, onerror?: (err: any) => void) {
        const transaction = (this.dbIstance as IDBDatabase).transaction([objectStoreName], mode as IDBTransactionMode);

        transaction.onerror = ((err) => {
            console.log('数据库事务错误', err);
            onerror?.(err);
        })

        transaction.oncomplete = (() => {
            console.log('数据库事务完成');
            oncomplete?.();
        })
        return transaction.objectStore(objectStoreName);
    }

    /**
     * 获取全部数据
     * @param objectStoreName 对象存储名称
     * @returns 
     */
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

    /**
     * 插入单条数据，或者批量插入数据
     * @param objectStoreName 对象存储名称
     * @param data 插入的数据：单个对象或数组
     * @returns 
     */
    add(objectStoreName: string, data: object | object[]) {
        return new Promise((resolve, reject) => {
            const objectStore = this.openTransaction(
                objectStoreName,
                'readwrite',
                () => resolve(true),
                err => reject(err)
            );
            if (Array.isArray(data)) {
                data.forEach(item => {
                    this.addData(objectStore, item);
                })
            } else {
                this.addData(objectStore, data);
            }
        });
    }

    /**
     * 插入单条数据
     * @param objectStore 对象存储
     * @param data 插入的数据
     */
    addData(objectStore: IDBObjectStore, data: object) {
        const request = objectStore.add(data);
        request.onsuccess = () => {
            console.log('数据插入成功', data);
        };
        request.onerror = event => {
            console.log('数据插入失败', event);
        };
    }

    /**
     * 修改单条数据，或者批量修改数据
     * @param objectStoreName 对象存储名称
     * @param data 修改的数据：单个对象或数组
     * @returns 
     */
    put(objectStoreName: string, data: object) {
        return new Promise((resolve, reject) => {
            const objectStore = this.openTransaction(
                objectStoreName,
                'readwrite',
                () => resolve(true),
                err => reject(err)
            );
            if (Array.isArray(data)) {
                data.forEach(item => {
                    this.putData(objectStore, item);
                })
            } else {
                this.putData(objectStore, data);
            }
        });
    }
    /**
     * 修改单条数据
     * @param objectStore 对象存储
     * @param data 修改的数据
     */
    putData(objectStore: IDBObjectStore, data: object) {
        const request = objectStore.put(data);
        request.onsuccess = () => {
            console.log('数据修改成功', data);
        };
        request.onerror = event => {
            console.log('数据修改失败', event);
        };
    }

    /**
     * 通过索引范围修改数据
     * @param objectStoreName 对象存储名称
     * @param indexName 索引名称
     * @param keyRangbe 索引范围
     * @param data 修改的数据
     * @returns 
     */
    putByIndex(objectStoreName: string, indexName: string, keyRangbe: [number | null, number | null] | number, data: object) {
        return new Promise((resolve, reject) => {
            const DBKeyRange = typeof keyRangbe === 'number' ? IDBKeyRange.only(keyRangbe) : IDBKeyRange.bound(...keyRangbe, true, true);
            console.log('DBKeyRange: ', DBKeyRange);
            const request = this.openTransaction(
                objectStoreName,
                'readwrite',
                () => resolve(true),
                err => reject(err)
            )
            .index(indexName) // 索引对象
            .openCursor(DBKeyRange); // 指针对象

            request.onsuccess = event => {
                const cursor = (event.target as any)?.result;
                console.log('获取游标成功', cursor);
                if (cursor) {
                    const value = cursor.value;
                    const putRequest = cursor.update({...value, ...data});
                    putRequest.onerror = (err: any) => {
                        console.log('通过游标修改数据失败', err);
                    };
                    putRequest.onsuccess = () => {
                        console.log('通过游标修改数据成功');
                    };
                    cursor.continue();
                }
            };
            request.onerror = event => {
                console.log('获取游标失败', event);
            };
        });
    }


    /**
     * 根据索引获取数据
     */
    getByIndex(objectStoreName: string, indexName: string, indexValue: any): Promise<any[]>  {
        return new Promise((resolve, reject) => {
            const request = this.openTransaction(
                objectStoreName,
                'readonly',
                () => resolve([]),
                err => reject(err)
            )
            .index(indexName) // 索引对象
            // .get(indexValue) // 索引值
            .openCursor(IDBKeyRange.only(indexValue)); // 指定索引值

            const results: any[] = [];
            request.onsuccess = event => {
                const cursor = (event.target as any)?.result;
                console.log('获取游标成功', cursor);
                if (cursor) {
                    results.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = event => {
                console.log('获取游标失败', event);
            };
        });
    }

    /**
     * 根据主键删除数据
     * @param objectStoreName 对象存储名称
     * @param primaryKey 主键
     * @returns 
     */
    delete(objectStoreName: string, primaryKey: string) {
        return new Promise((resolve, reject) => {
            const request = this.openTransaction(
                objectStoreName,
                'readwrite',
                () => resolve(true),
                err => reject(err)
            ).delete(primaryKey);
            request.onsuccess = () => {
                console.log('数据删除成功');
            };
            request.onerror = event => {
                console.log('数据删除失败', event);
            };
        });
    }

    /**
     * 清空全部数据
     * @param objectStoreName 对象存储名称
     * @returns 
     */
    clear(objectStoreName: string) {
        return new Promise((resolve, reject) => {
            const request = this.openTransaction(
                objectStoreName,
                'readwrite',
                () => resolve(true),
                err => reject(err)
            ).clear();

            request.onsuccess = () => {
                console.log('数据清除成功');
            };
            request.onerror = event => {
                console.log('数据清除失败', event);
            };
        })
    }

    /**
     * 删除数据看
     * @returns 
     */
    deleteDB() {
        const request = window.indexedDB.deleteDatabase(this.dbName);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('删除数据库成功');
                resolve(true);
            };
            request.onerror = event => {
                console.log('删除数据库失败');
                reject(event);
            };
        });
    }
}
