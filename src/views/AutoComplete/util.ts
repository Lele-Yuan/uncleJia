import { searchItem } from './type'
const FlexSearch = require("flexsearch");


export function filterQuery(dataList: searchItem[] , q: string, limit: number = 50){
    return dataList.filter((item) => {
        const words = q.trim().toLowerCase().split(/[ ,]+/);
      
        // $& means the whole matched string
        const regexWords = words.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        const regex = `(\\s|\\b)(${regexWords.join("|")})`;
        const regExp = new RegExp(regex, "gi");
        return regExp.test(item.title)
        // item.title.toLowerCase().startsWith(q.toLowerCase()) && console.log(HighlightMatch({title: item.title, q:q}));
        // return item.title.toLowerCase().startsWith(q.toLowerCase())
    }).splice(0, limit)
}

let flex: any;
export function flexsearchQuery(dataList: searchItem[] , q: string, limit: number = 50){
    if(!flex){
        flex = FlexSearch.create({ tokenize: "forward" });
        dataList!.forEach(({ title }, i) => {
            flex.add(i, title);
        });
    }
    const indexResults = flex.search(q, {
        limit,
        suggest: true, // This can give terrible result suggestions
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
    const regex = `(\\s|\\b)(${regexWords.join("|")})`;
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