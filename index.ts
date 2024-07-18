import express,{Express} from "express"; 

const app: Express = express();



const port = process.env.PORT || 3000; 

app.listen(port, () =>{
    console.log("server is running on PORT: " + port)
})

