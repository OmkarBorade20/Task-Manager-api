const express=require('express')
const users=require('../models/users')
const auth=require('../middleware/auth')
const user = require('../models/users')
const multer=require('multer')

const router=express.Router()

router.use(express.json())


//middle ware for file upload avtar 
const avatar=multer({
    
    limits:{
        fileSize:2000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg|PNG|JPG)$/)){
            return cb(new Error('Please upload a jpeg or png or jpg file!'))
        }
        cb(undefined,true)
    }
})

//uploading avtar for user

router.post('/user/me/avatar',auth,avatar.single('avatar'),async(req,res)=>{
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.status(201).send({Message:"File Uploaded Sucessfully!!"})
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})

})
//deleteing avtar
router.delete('/user/me/avatar',auth,async(req,res)=>{
    if( req.user.avatar===undefined){
       return res.status(400).send({error:"no Avtar present"})
    }
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send("Sucessfully Deleted Avtar!!")
},(error,req,res,next)=>{res.status(500).send({error:error.message})})

//creating new users

router.post('/users',async(req,res)=>{
    const user=new users(req.body)
     try
     {
         await user.save()
         const token=await user.gentoken()
         res.status(201).send({user,token})
     }
     catch(e)
     {
         res.status(400).send(e)
     }
    
 //    user.save().then(()=>{
 //        res.status(201).send(user)
 //    }).catch((e)=>{
 //     res.status(400).send(e)
 //    })
 })
 

 router.get('/users/:id/avatar',async(req,res)=>{
     try{
        const user=await users.findById(req.params.id)
        if(!user){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)

     }catch(e){
        res.status(404).send()
     }
 })
 router.post('/users/login',async(req,res)=>{

     try{
        const user= await users.findbycredentials(req.body.email,req.body.password)
        const token=await user.gentoken()
        if(!user)
        {
            res.status(404).send('Coudnt login!!')
        }
        
        res.send({user,token})
     }catch(e){
         res.status(404).send(e)
     }
   
 })
 
 router.get('/users/me',auth,async (req,res)=>{
 
   res.send(req.user)

    //  try{
    //    const allusers=  await users.find({})
    //      res.send(allusers)
    //  }catch(e){
    //      res.status(500).send(e)
    //  }
     
     // user.find({}).then((users)=>{
     //     res.send(users)
     // }).catch(()=>{
     // res.status(500).send()
     // })
 })

 
 router.post('/user/logout',auth,async(req,res)=>{

     try{
         req.user.tokens=req.user.tokens.filter((token)=>{ return token.token!==req.token})
         await req.user.save()
         res.status(201).send()
     }
     catch(e){
         res.status(500).send(e)
     }
 })

 router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send({message:"Sucessfully Loggedout!!!!"})
    }catch(e){
        res.status(500).send()
    }   
 })
 router.get('/user/:id',async(req,res)=>{
 
     const _id=req.params.id
 
     try{
         const u=await users.findById({_id})
         if(!u)
         {
             return res.status(404).send()
         }
         res.send(u)
     }catch(e){
         res.send(e)
     }
     
     // user.findById({_id}).then((user)=>{
     //     if(!user)
     //     {
     //         return res.status(404).send()
     //     }
     //     res.send(user)
     // }).catch(()=>{
     //     res.status(500).send()
     // })
 })
 
 //updating users
 
router.patch('/user/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdate=['name','password','age','email']
    const isvalid=updates.every((update)=>{return allowedUpdate.includes(update)})
    if(!isvalid)
    {
        return res.status(400).send()
    }
   
    try
    {

        // const u=await users.findById(req.params.id)
        const u=req.user
        updates.forEach((update)=>u[update]=req.body[update] )
        await u.save()
    //     console.log(req.body)
    //  const u=await users.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //  if(!u)
    //  {
    //     return res.send('no user present')
    //  }
     res.status(201).send(u)
    }
    catch(e)
    {
        res.status(400).send('Wrong update')
    }
     })
 
     router.delete('/users/me',auth,async(req,res)=>{
         try
         {
            // const u=await user.findByIdAndDelete(req.user._id)
            // if(!u)
            // {
            //     return res.status(404).send()
            // }
            await req.user.remove()
            res.send(req.user)
         }
         catch(e)
         {
            res.status(500).send()
         }
     })
 

module.exports=router