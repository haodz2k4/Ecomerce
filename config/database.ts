import {connect} from 'mongoose';

export const getConnection = async (url: string | undefined) :Promise<void> =>{
    try {
        if(typeof url === 'string'){
            await connect(url);
            console.log("connect database successfull");
        }else{
            console.log("url is undefined")
        }
        
    } catch (error) {
        console.log("connect database failed")
        console.error(error)
    }
}