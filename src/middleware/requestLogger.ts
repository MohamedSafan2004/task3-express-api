import { Request,Response,NextFunction } from "express";

//middleware 
export const requestLogger=(req:Request ,res:Response,next:NextFunction)=>{
const start = Date.now();
res.on("finish",()=>{
 const duration= Date.now()-start;
console.log(` loged at [${new Date().toISOString()}]  ${req.method} , ${req.url} finshed in ${duration}ms`)})

next();
}


