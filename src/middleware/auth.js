const jwt=require('jsonwebtoken')
const user = require('../models/users')
const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
     
        const decode= jwt.verify(token,process.env.JWT_SECRET)
       
        const u=await user.findOne({ _id: decode._id,'tokens.token':token})
       //console.log("User :",u)
        if(!u)
        {
            throw new Error()
        }
        req.token=token
         req.user=u
      
        next()
    }
    catch(e)
    {
        res.status(401).send({error: 'please Authenticate'})
    }
   
}

module.exports=auth