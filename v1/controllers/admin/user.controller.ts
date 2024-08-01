import { Request, Response } from "express";
import { Error } from "mongoose";
import { hash } from "bcrypt";
//model
import User from "../../models/user.model";
import Address from "../../models/address.model"
//helper
import { buildFindQuery,buildSorting } from '../../../helpers/search.helper';
import { getPagination } from '../../../helpers/pagination.helper';
//[GET] "/admin/users" 
export const index = async  (req: Request, res: Response) :Promise<void> =>{

    try {
        const find = buildFindQuery(req);
        const sort = buildSorting(req,{createdAt: "desc"});
        const counts = await User.countDocuments(find)
        const pagination = getPagination(req,counts,15)
        const users = await User.find(find)
        .sort(sort)
        .select("fullName avatar email phone status createdAt gender")
        .skip(pagination.skip)
        .limit(pagination.limit);
        
        res.json({users,counts, pagination})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn database", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu"})
        }
    }
}   
//[GET] "/admin/users/detail/:id"
export const detail = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;
    
    try {
         const user = await User.findById(id);
         if(!user){
            res.status(404).json({message: "Không tìm thấy người dùng tương ứng"});
            return;
         }
         const address = await Address.find({user_id: id});
         res.status(200).json({user, address});
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn database", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu"})
        }
    }
} 
//[PATCH] "/admin/users/change/status/:id"
export const changeStatus = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;
    const status = req.body.status;
    try {
        const user = await User.findByIdAndUpdate(id, {status},{new: true, runValidators: true}).select("status");
        if(!user){
            res.status(404).json({message: "Người dùng không tồn tại"});
            return; 
        }

        res.status(200).json({message: "Cập nhật trạng thái thành công", user})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi cập nhật trạng thái", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi khi cập nhật dữ liệu"})
        }
    }
}
//[PATCH] "/admin/users/change/multi/:type";
export const changeMulti = async (req: Request, res: Response) :Promise<void> =>{
    const type = req.params.type;
    const ids = req.body.ids; 
    const users: any = []; 
    const [key,value] = type.split("-")
    try { 
        for(const id of ids){
            const user = await User.findByIdAndUpdate(id, {[key]: value},{new: true,runValidators: true}).select(key);
            users.push(user);
        }
        res.status(200).json({message: "Cập nhật nhiều người dùng thành công",users})
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không thể không cập nhật người dùng", error: error.message})
        }else{
            res.status(500).json({ message: "Lỗi không xác định" });
        }
    }
} 
//[PATCH] "/admin/users/edit/:id"
export const edit = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;
    const body = req.body; 
    body.password = hash(body.password,10); 

    try {
        const user = await User.findByIdAndUpdate(id,body,{new: true, runValidators: true});

        if(!user){
            res.status(404).json({message: "Không tìm thấy người dùng"});
            return;
        }
        res.status(200).json({message: "Cập nhật thành công", user});
    } catch (error) {
        console.error(error);
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi không thể không cập nhật người dùng", error: error.message})
        }else{
            res.status(500).json({ message: "Lỗi không xác định" });
        }
    }
} 
//[PATCH] "/admin/users/delete/:id"
export const deleteUser = async (req: Request, res: Response) :Promise<void> =>{
    const id = req.params.id;

    try {
        const user = await User.findByIdAndUpdate(id, {deleted: true});
        if(!user){
            res.status(404).json({message: "Người dùng không tồn tại"});
            return; 
        }
        res.status(200).json({message: "Xóa người dùng thành công"})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi xóa người dùng", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}