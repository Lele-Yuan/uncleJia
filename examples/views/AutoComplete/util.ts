import { searchItem } from './type'
// const { Index, Document, Worker } = require("flexsearch");
// @ts-ignore
import FlexSearch from './flexSearch/webpack'

export function filterQuery(dataList: searchItem[] , q: string, limit: number = 50){
    return dataList.filter((item) => {
        const words = q.trim().toLowerCase().split(/[ ,]+/);
      
        // $& means the whole matched string
        const regexWords = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        const regex = `(${regexWords.join("|")})`;
        const regExp = new RegExp(regex, "gi");
        return regExp.test(item.title)
        // item.title.toLowerCase().startsWith(q.toLowerCase()) && console.log(HighlightMatch({title: item.title, q:q}));
        // return item.title.toLowerCase().startsWith(q.toLowerCase())
    }).splice(0, limit)
}

export function testTimeout() {
    console.log('testTimeout')
}

let indexIndex: any;
export function flexsearchQuery(dataList: searchItem[] , q: string, limit: number = 100){
    dataList = [
        {"title":"html 开发技术 web 学习技术 开发","url":"html/zh-CN/docs/Web"},
        {"title":"html CSS JavaScript","url":"/zh-CN/docs/Web/JavaScript"},
        {"title":"JavaScript 参考","url":"/zh-CN/docs/Web/JavaScript/Reference"},
        {"title":"Web API 接口参考","url":"/zh-CN/docs/Web/API"},
    ]
    if(!indexIndex){
        indexIndex = new FlexSearch.Index({ 

            // tokenize: full reverse forward strict(default)
            // tokenize: strict 在 add 阶段注册encode编码后的整个词组  其他值可以匹配单个字符
            // 例如 搜索web   tokenize: 'strict'的返回的结果集中不会包含WebGL tokenize: 'full'结果集中包含WebGL
            tokenize: 'full', 
            
            // context is just supported by tokenizer "strict"
            // context: {
            //     depth: 3,
            //     bidirectional: false
            // },

            // encode 将字符串匹配成数组
            // encode: (str: string) => str.trim().toLowerCase().split(''),

            // resolution存储索引的容器大小，
            // resolution: 2,
            
            // optimize: false 表示不进行内存优化 默认 true
            // optimize: false,

            // charset可以选择FlexSearch编码的策略
            // charset: 'latin:advanced',

            // 语言
            // lang: {matcher, stemmer, filter}

            // fastupdate 默认为true
            // fastupdate: false,

            // minlength 定义最少存放的字符长度
            // minlength: 3,

            // boost 仅在 strict 模式下生效  optimize: true
            // boost: (arr: [string], str: string, init: number) => {
            //     return arr.join('').includes('开发') ? 1/2 : 2
            // }

            // rtl 支持从右到左的编码。
            // rlt: true,
            

        });
        dataList!.forEach(({ title }, i) => {
            indexIndex.add(i, title);
        });
    }
    let indexResults = indexIndex.search({
        query: q,
        limit,  // limit 返回结果数量默认100
        // suggest true false
        // suggest: true 可以实现 搜索web abc可以返回包含web的数据
        // suggest: false 搜索web abc时返回无结果
        suggest: true, // This can give terrible result suggestions
        // context: true false
    });
    testTimeout();
    // 搜索关键字会根据初始化 options.encode(str) 进行编码成数组
    return indexResults.map(
        (index: number) => (dataList || [])[index]
    );
}

let workerIndex: any;
export async function flexsearchQueryWork(dataList: searchItem[] , q: string, limit: number = 100) {
    // dataList = [
    //     {"title":"html 开发技术 web 学习技术 开发","url":"/zh-CN/docs/Web"},
    //     {"title":"html CSS JavaScript","url":"/zh-CN/docs/Web/JavaScript"},
    //     {"title":"JavaScript 参考","url":"/zh-CN/docs/Web/JavaScript/Reference"},
    //     {"title":"Web API 接口参考","url":"/zh-CN/docs/Web/API"},
    // ]
    if(!workerIndex){
        workerIndex = new FlexSearch.Worker({ 
            tokenize: 'full',
            // index 或者 field
            // index: [ 'title', 'url' ],
            // tag 给标签起一个名称，可以在注册或查找时给数据进行分类
            // tag: 'tag',
            // 允许存储复杂的的数据结构，用来和 search 阶段的 enrich: true 配合使用获取复杂的结果集
            // store: true,
            // 给key起一个别名，默认为 'id'
            // id: 'id'

            // worker  
            // false，this.index 中存放的相多个 new Index ，相当于多次使用 new Index
            // true 
            // worker: true

        });
        dataList!.forEach(async ({ title }, i) => {
            workerIndex.add(i, title);
        });
    }
    let indexResults = await workerIndex.search({
        query: q,
        limit,  // limit 返回结果数量默认100
        // suggest true false
        // suggest: true 可以实现 搜索web abc可以返回包含web的数据
        // suggest: false 搜索web abc时返回无结果
        suggest: true, // This can give terrible result suggestions
        // context: true false
    });
    testTimeout();
    return indexResults.map(
        (index: any) => (dataList || [])[index]
    );
}
let documentIndex: any;
export async function flexsearchQueryDocument(dataList: searchItem[] , q: string, limit: number = 100) {
    dataList = [
        {"title":"html 开发技术 web 学习技术 开发","url":"html/zh-CN/docs/Web", tag: ['content', 'link']},
        {"title":"html CSS JavaScript","url":"/zh-CN/docs/Web/JavaScript", tag: ['link']},
        {"title":"JavaScript 参考","url":"/zh-CN/docs/Web/JavaScript/Reference", tag: 'link'},
        {"title":"Web API 接口参考","url":"/zh-CN/docs/Web/API", tag: 'link'},
    ]
    if(!documentIndex){
        // self && ((self as any)['_factory'] = Example)
        documentIndex = new FlexSearch.Document({ 
            tokenize: 'full',
            // index 或者 field
            field: [ 'title', 'url' ],
            // tag 给标签起一个名称，可以在注册或查找时给数据进行分类
            tag: 'tag',
            // 允许存储复杂的的数据结构，用来和 search 阶段的 enrich: true 配合使用获取复杂的结果集
            // store: true,
            // 给key起一个别名，默认为 'id'
            // id: 'id'

            // worker  
            // false，this.index 中存放的相多个 new Index ，相当于多次使用 new Index
            // true 
            // worker: true

        });
        // self && ((self as any).FlexSearch.Index = documentIndex)
        dataList!.forEach(({title, url, tag}, i) => {
            // documentIndex.add({id: i, title, url: '', tag: 'content'});
            // documentIndex.add({id: i, title: '', url, tag: 'link'});
            documentIndex.add({id: i, title, url, tag: tag})
        });
    }
    
    const words = q.trim().toLowerCase().split(/[ ,]+/);
    let indexResults: searchItem[] = [];
    const documentResults = documentIndex.search(q, {
        // search:  bool  
        // enrich:true(配合初始化 store: true) 最终结果生成复杂的结构，result: [{id, doc}]
        // store 中存储这 doc 结构数据
        limit,
        bool: 'and',
        tag: [ 'content', 'link' ],
        // enrich: true
    })
    console.log(documentResults);
    documentResults.forEach((document: any) => {
        document.result.forEach((element: any) => {
            (indexResults.indexOf(element) === -1) && indexResults.push(element)
        });
    });
    return indexResults.map(
        (index: any) => (dataList || [])[index]
    );
}

export function HighlightMatch({ title, q }: { title: string; q: string }) {
    // FlexSearch doesn't support finding out which "typo corrections"
    // were done unfortunately.
    // See https://github.com/nextapps-de/flexsearch/issues/99
  
    // Split on higlight term and include term into parts, ignore case.
    const words = q.trim().toLowerCase().split(/[ ,]+/);
  
    // $& means the whole matched string
    const regexWords = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = `(\\s|\\b|)(${regexWords.join("|")})`;
    const parts = title.split(new RegExp(regex, "gi"));
    return `<b>
            ${parts.map((part, i) => {
                const key = `${part}:${i}`;
                if (words.includes(part.toLowerCase())) {
                    return `<mark key=${key}>${part}</mark>`;
                } else {
                    return `<span key=${key}>${part}</span>`;
                }
            }).join('')}
        </b>`;
}

let debounceTimer: any = null;
export function lodashDebounce(debonceFun: Function, debounceTime=500) {
    return () => {
        debounceTimer && clearTimeout(debounceTimer);
        debounceTimer = setTimeout(debonceFun, debounceTime);
    }
}
