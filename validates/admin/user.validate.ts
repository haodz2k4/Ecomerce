import { Request, Response,NextFunction } from "express"
import User from "../../models/user.model";
export const changeMulti = async (req: Request, res: Response, next: NextFunction) :Promise<void> =>{

    const ids = req.body.ids; 
    const type = req.params.type;
    const validType: string[] = ["status-active","status-inactive","deleted-true","deleted-false"];
    if(!validType.includes(type)){
        res.status(400).json({message: "Thể loại không hợp lệ"});
        return;
    }
    if(!Array.isArray(ids)){
        res.status(400).json({message: "ids phải là mảng"});
        return;
    } 

    try {
        const users = await User.find({_id: {$in: ids}});
        if(users.length !== ids.length){
            res.status(400).json({message: "danh sách người dùng không tồn tại"});
            return;
        }
    
        next();
    } catch (error) {
        next(error)
    }
}