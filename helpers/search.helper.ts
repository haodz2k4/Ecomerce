
import { Request } from "express";
interface Find {
    deleted: boolean,
    status?: string,
    title?: RegExp
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