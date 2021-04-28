const { json } = require('express')
const express=require('express')
const tasks=require('../models/tasks')
const auth=require('../middleware/auth')
const user = require('../models/users')
const task = require('../models/tasks')
const router=express.Router()


router.use(express.json())
router.post('/task',auth,async(req,res)=>{
    // const task=new tasks(req.body)
    const task=new tasks({
        ...req.body,
       owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(c){
        res.send(400)
    }
    
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.get('/tasks',auth,async (req,res)=>{

    // req.query.completion
    const match={}
    const sort={}
    if(req.query.completion){
        match.completion=req.query.completion ==='true'
    }
    if(req.query.sortBy)
    {
        const part=req.query.sortBy.split('_')
        sort[part[0]]=part[1]==='desc'?-1:1
    }
    try{
       
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
           
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(400).send()
    }
    
//    tasks.find({}).then((task)=>{
//         res.send(task)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
})

router.get('/task/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const t=await tasks.findById({_id})
        const t=await tasks.findOne({_id,owner:req.user._id})
        
        if(!t){
           return res.status(404).send()
        }
        res.send(t)
    }catch(e){
        res.status(500).send(e)
    }
    // tasks.findById({_id}).then((task)=>{
    //     if(!task){
    //         return res.status(404).sendsend()
    //     }
    //     res.send(task)
    // }).catch(()=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdate=['description','completion']
    const isvalid=updates.every((update)=>{ return allowedUpdate.includes(update)})
   
    if(!isvalid)
    {
        return res.status(400).send({error:'Invalid Updates!!'})
    }
   
    try{
        
        const t=await tasks.findOne({_id:req.params.id,owner:req.user._id})
        if(!t){
            return res.status(404).send()
        }
        updates.forEach((update)=> t[update]=req.body[update])
        await t.save()
        // const t= await tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
       
        res.send(t)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try
    {
        const t=await task.findOneAndDelete({_id:req.params.id,owner:req.user._id}) 
        if(!t){
            res.status(400).send()
        }
        res.status(200).send(t)
    }
    catch(e)
    {
        res.status(500).send()
    }
})


module.exports=router