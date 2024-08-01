    import { Request, Response, NextFunction } from "express";
    import User from "../../models/user.model";
    import Cart from "../../models/cart.model";
    import jwt from "jsonwebtoken";
    export const requireAuth = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{
        if(!req.headers.authorization){
            res.status(401).json({message: "Vui lòng gửi token người dùng"}) ;
            return;

        } 

        const token = req.headers.authorization.split(" ")[1]; 
        try {
            const encode: any = jwt.verify(token,process.env.JWT_SECRET as string);
            const user = await User.findById(encode?.userId);
            if(!user){
                res.status(401).json({message: "Token của bạn gửi không hợp lệ"});
                return;
            } 
            const cart = await Cart.findOne({user_id: user.id});
            if(!cart){
                const newCart = new Cart({user_id: user.id});
                await newCart.save();
                res.locals.cart = cart;
            }else{
                
                res.locals.cart = cart;
            }
            res.locals.user = user;
    
            next()
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Token đã hết hạn" });
            } else if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({ message: "Token không hợp lệ" });
            }else{
                next(error);
            }
        }
    }