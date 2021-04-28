const express=require('express')
const users = require('./models/users')
const tasks = require('./models/tasks')
const userroute=require('../src/router/userroutes')
const taskroute=require('../src/router/taskroutes')

require('./db/mongoose')


const app=express()

app.use(userroute)
app.use(taskroute)
const port=process.env.PORT 
//auto parsing 
app.use(express.json())


app.listen(port,()=>{
    console.log('Server Started on port'+port)
})

//to block all get req.
// app.use((req,res,next)=>{
//     if(req.method ==='GET')
//     {
//         console.log(req.method)
//         next()
       
//     }
//     else{
//         res.status(503).send("Site is Under Maintainence")
//     }
     
// })

//uploading files

// const multer=require('multer')


// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:2000000
//     },
//     fileFilter(req,file,cb){
//         if(!file.originalname.endsWith('png')){
//             return cb(new Error('Please Upload a png file!!.'),false)
//         }
//         cb(undefined,true)
//     }
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message}) 
// })
// testing
// const task=require('../src/models/tasks')
// const user=require('../src/models/users')
// const main=async()=>{

//     // //taking a task and finding its owner
//     // const t=await task.findById('6085da23a958b0053c5773e5')
//     // await t.populate('owner').execPopulate()
//     // console.log(t.owner)


//     //owner geting all tasks
//     const u=await user.findById('6085d9a2d60a8d2180abb347') 
//     await u.populate('tasks').execPopulate()
//     console.log(u.tasks)
// }
// main()