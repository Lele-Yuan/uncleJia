import { searchItem } from './type'
const { Index, Document, Worker } = require("flexsearch");


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

let indexIndex: any;
let documentIndex: any;
export function flexsearchQueryDocument(dataList: searchItem[] , q: string, limit: number = 100) {
    if(!documentIndex){
        documentIndex = new Document({ 
            tokenize: 'full',
            index: [
                'title', 'url'
            ]
        });
        dataList!.forEach(({title, url}, i) => {
            documentIndex.add({id: i, title, url});
        });
    }
    
    const words = q.trim().toLowerCase().split(/[ ,]+/);
    const documentResults: {filed: string; result: number[]}[] = documentIndex.search(q, {
        limit,
        bool: 'and',
        index: ['title', 'url'],
    });
    let indexResults: number[] = [];
    documentResults.forEach(document => {
        indexResults = indexResults.concat(document.result.filter(item => (indexResults.indexOf(item) == -1)));
    });
    return indexResults.map(
        (index: number) => (dataList || [])[index]
    );
}
export function flexsearchQuery(dataList: searchItem[] , q: string, limit: number = 100){
    if(!indexIndex){
        indexIndex = new Index({ 
            tokenize: 'full', 
            // encude: (str: string) => {
            //     return str.trim().toLowerCase().split(/[ ,]+/);
            // }
        });
        dataList!.forEach(({ title }, i) => {
            indexIndex.add(i, title);
        });
    }
    let indexResults = indexIndex.search({
        query: q,
        limit,
        suggest: true, // This can give terrible result suggestions
        bool: 'or'
    });
    return indexResults.map(
        (index: number) => (dataList || [])[index]
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