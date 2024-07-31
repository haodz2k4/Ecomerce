import { Request, Response } from "express"
import SettingGeneral from "../../../models/setting-general.model";
//[GET] "/admin/settings/general"
export const general = async (req: Request, res: Response):Promise<void> =>{

    try {
        const settingGeneral = await SettingGeneral.findOne();
        
        res.status(200).json({settingGeneral});
        
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thực hiện truy vấn", error: error.message});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
    
}

//[PATCH] "/admin/settings/general/edit"
export const editGeneral = async (req: Request, res: Response):Promise<void> => { 
    const body = req.body;
    try {
        const existsRecord = await SettingGeneral.exists({}); 
        if(existsRecord){
            const settingGeneral = await SettingGeneral.findOneAndUpdate({},body,{new: true, runValidators: true});
            res.status(200).json({message: "Cập nhật thành công", settingGeneral})
        }else{
            const settingGeneral = new SettingGeneral(body);
            await settingGeneral.save();
            res.status(201).json({message: "Thêm cài đặt chung thành công",settingGeneral})
        }
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({message: "Lỗi khi thêm/ cập nhật cài đặt chung"});
        }else{
            res.status(500).json({message: "Lỗi không xác định"});
        }
    }
}