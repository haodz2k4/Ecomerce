import { Request, Response } from "express";
import { Error } from "mongoose";
//models
import Cart from "../../models/cart.model"; 

//[GET] "/cart"
export const index = async (req: Request, res: Response) :Promise<void> =>{

    const userId = res.locals.user.id;
    try {
        const carts = await Cart.find({
            user_id: userId
        })
    
        res.json({carts})
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi truy vấn dữ liệu", error: error.message})
        }else{
            res.status(500).json({message: "Lỗi không xác định"})
        }
    }
}