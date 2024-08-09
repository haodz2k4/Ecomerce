import { Request } from "express";

export interface Pagination {
    limit: number;
    currentPage: number;
    skip: number;
    countPage?: number;
}

const defaultPagination: Pagination = {
    limit: 0,
    currentPage: 1,
    skip: 0,
};

export const getPagination = (req: Request, count: number, defaultLimit: number): Pagination => {
    const pagination: Pagination = { ...defaultPagination };
    pagination.limit = defaultLimit;
    const pageQuery = req.query.pages;
    const limitQuery = req.query.limit;
    if (typeof pageQuery === 'string') {
        pagination.currentPage = parseInt(pageQuery);
    }
    if (typeof limitQuery === 'string') {
        pagination.limit = parseInt(limitQuery);
    }
    pagination.skip = (pagination.currentPage - 1) * pagination.limit;
    pagination.countPage = Math.ceil(count / pagination.limit);
    return pagination;
};
