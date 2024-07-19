
import { Request } from "express";
interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp
} 
type sortType = "asc" | "desc"
interface Sort {
    [key: string]: sortType
}
export const buildFindQuery = (req: Request): Find => {
    const find: Find = { deleted: false };

    const keyword = req.query.keyword;
    const status = req.query.status;
    
    if (typeof keyword === 'string') {
        find.title = new RegExp(keyword, "i");
    }

    if (typeof status === "string") {
        find.status = status;
    }

    return find;
}
export const buildSorting = (req: Request):Sort =>{ 
    const sort: Sort = {};
    const sortKey = req.query.sortKey;
    const valueKey = req.query.valueKey;

    if(typeof sortKey === 'string' && (valueKey === "asc" || valueKey === "desc")){
        sort[sortKey] = valueKey
    }
    return sort;
} 