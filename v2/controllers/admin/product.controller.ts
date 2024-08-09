import { NextFunction, Request, Response } from "express";
//service 
import * as ProductService from "../../services/product.services";
import { getPagination } from './../../../helpers/pagination.helper';
import { buildSorting } from './../../../helpers/search.helper';
//[GET] "/admin/products"
export const index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { 
        interface Find {
            deleted: boolean,
            status?: string,
            hightlighted?: string,
            title?: RegExp
        }
        const find: Find = {
            deleted: false
        } 
        const keywordQuery = req.query.keyword 
        if (typeof keywordQuery === "string") { 
            const regExp = new RegExp(keywordQuery)
            find.title = regExp
        } 
        const status = req.query.status 
        if(typeof status === 'string'){
            find.status = status
        }
        //sort
        const sort = buildSorting(req,{position: 'desc'})
        const counts = await ProductService.getCounts(find)
        const pagination = getPagination(req,counts,15)
        const products = await ProductService.getProducts(find,pagination, sort);

        res.status(200).json({ products, pagination });
    } catch (error) {
        next(error)
    }
};
//[PATCH] "/admin/products/change/status/:id"
export const changeStatus = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const id = req.params.id 
    const status = req.body.status
    try {
        const product = await ProductService.changeStatus(id, status)

        res.status(200).json({message: "Cập nhật sản phẩm thành công", product})
    } catch (error) {
        next(error)
    }
} 
//[PATCH] "/admin/products/change/multi/:type"
export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const type = req.params.type 
    const ids = req.body.ids
    try {
        switch(type){
            case 'delete': 
                const infoUpdateDelete = await ProductService.changeMultiDelte(ids);
                res.status(200).json({message: "Xóa nhiều sản phẩm thành công", infoUpdateDelete}) 
                break; 
            case 'status': 
                const status = req.body.status 
                const infoUpdateStatus = await ProductService.changeMultiStatus(ids, status)
                res.status(200).json({message: "Thay đổi trạng thái nhiều sản phẩm thành công",infoUpdateStatus})
                break;
            case 'position': 
                
                const products = await ProductService.changeMultiPosition(ids);
                res.status(200).json({message: "Thay đổi vị trí nhiều sản hẩm thành công", products})
                break;
            default: 
            res.json(400).json({message: "Thể loại không hợp lệ"})
        }
    } catch (error) {
        next(error)
    }
}
//[GET] "/admin/products/edit/:id"
export const edit = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    try {
        const id = req.params.id 
        const body = req.body
        const product = await ProductService.editProduct(id,body);
        res.status(200).json({message: "Cập nhật thành công", product})
        
    } catch (error) {
        next(error)
    }
    
} 
//[PATCH] "/admin/products/delete/:id"
export const deleteUser = async (req: Request, res: Response, next: NextFunction):Promise<void> =>{
    const id = req.params.id 
    try {
        const product = await ProductService.deleteProduct(id)
        res.status(200).json({message: "Xóa sản phẩm thành công", product})
    } catch (error) {
        next(error)
    }
} 
//[POST] "/admin/products/add"
export const add = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const body = req.body;

    try { 
        if(body.position){
            body.position = parseInt(body.position)
        }else{
            body.position = await ProductService.getCounts() + 1
        }
        const product = await ProductService.create(body);
        res.status(200).json({message: "Thêm thành công", product})
    } catch (error) {
        next(error)
    }
} 
//[PATCH] "/admin/products/change/position/:id"
export const changePosition = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    const id = req.params.id 
    const position = req.body.position 

    try {
        const product = await ProductService.changePosition(id, position)
        res.status(200).json({message: "Cập nhật vị trí thành công",product})
    } catch (error) {
        next(error)
    }
}   
//[PATCH] "/admin/products/change/category/:id"
export const changeCategory = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const id = req.params.id 
    const category_id = req.body.category_id
    try {
       const product = await ProductService.changeCategory(id,category_id)
        res.status(200).json({message: "Cập nhật danh mục thành công", product})
    } catch (error) {
        next(error)
    }
}
//[DETAIL] "/admin/products/detail/:id"
export const detail = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
    try {
        const id = req.params.id
        const product = await ProductService.getProduct({_id: id, deleted: false})
        const stocks = await ProductService.getStockByProductId(id)
        res.status(200).json({product,stocks})
    } catch (error) {
        next(error)
    }
}
//[GET] "/admin/products/suggestions"
export const suggestions = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    const keyword = req.query.keyword as string 
    try {
       const find = {deleted: false}
       const products =await ProductService.getSuggestions(keyword,find) 
       res.status(200).json({products})
    } catch (error) {
        next(error)
    }
}