import { NextFunction,Response, Request} from 'express';
import ApiError from '../../utils/ApiError.util';
export const errorHandler = (error: any,req: Request,res: Response, next: NextFunction) => {

    console.error(error)
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
    } else if (error instanceof Error) { 
        if(error.name === 'ValidationError'){
            res.status(400).json({message: "Lỗi xác thực", error: error.message})
        }else{
            res.status(500).json({message: error.message})
        }
    }else{
        res.status(500).json({message: "Lỗi không xác định"})
    }
}