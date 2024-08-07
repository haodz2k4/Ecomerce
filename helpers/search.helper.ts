
import { Request } from "express";
interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp,
    highlighted?: string,
    minValue?: number,
    maxValue?: number,
    [key: string]: any
} 
type sortType = "asc" | "desc";
interface Sort {
    [key: string]: sortType
}
export const buildFindQuery = (req: Request, name: string = "title"): Find => {
    const find: Find = { deleted: false };

    const keyword = req.query.keyword;
    const status = req.query.status;
    
    if (typeof keyword === 'string') {
        find[name] = new RegExp(keyword, "i");
    }

    if (typeof status === "string") {
        find.status = status;
    } 

    //range price
    const minValue = req.query.minValue;
    const maxValue = req.query.maxValue;
    if(typeof minValue === 'string' && typeof maxValue === 'string'){ 
        find.price = {$lte: parseInt(maxValue), $gte: parseInt(minValue)}
    }

    return find;
}
export const buildSorting = (req: Request,defaultSort: Sort):Sort =>{ 
    let sort: Sort = {};
    const sortKey = req.query.sortKey;
    const valueKey = req.query.valueKey as sortType;

    if(typeof sortKey === 'string' && valueKey){
        sort[sortKey] = valueKey
    } else{
        sort = {...defaultSort}
    }

    return sort;
} 
export const buildSuggestions = (req: Request) =>{
    const find: Find = {deleted: false}; 
    const keyword = req.query.keyword;

    if(typeof keyword === 'string'){
        find.title = new RegExp(keyword,"i")
    } 

    return find;

}


