const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const task = require('./tasks')

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
    
        },
        email:{
            type:String,
            required:true,
            trim:true,
            unique:true,
            validate(value)
            {
                if(!validator.isEmail(value))
                {
                    throw new Error('Enter valid Email!!')
                }
            }
        },
        password:{
            type:String,
            required:true,
            minlength:7,
            trim:true,
        },
        age:{
            type:Number,
            required:true,
            trim:true,
            validate(value)
            {
                if(value<0)
                {
                    throw new Error('Age Should not be negative!')
                }
            }
        },
        tokens:[{
            token:{
                type:String,
                requiredred:true
            }
        }],
        avatar:{
            type:Buffer
        }
    },{
        timestamps:true
    }
)

userSchema.virtual('tasks',{
    ref:'Task',
   localField:'_id',
   foreignField:'owner'
})

userSchema.methods.gentoken=async function(){
const u=this
const token=await jwt.sign({_id:u._id.toString()},'login')
u.tokens=u.tokens.concat({token})
await u.save()
return token
}

userSchema.statics.findbycredentials=async (email,password)=>
{
    const u=await user.findOne({email})
    if(!u){
        throw new Error('Not Loggdin !!')
    }
    const ismatch=await bcrypt.compare(password,u.password)
    if(!ismatch){
        throw new Error('Not Loggdin !!')
    }
    return u
}
userSchema.methods.toJSON= function(){
    u=this
    userobject=u.toObject()
    delete userobject.password
    delete userobject.tokens
    return userobject
}

//middle ware
userSchema.pre('save',async function(next)
{
    const user=this
    if(user.isModified('password'))
    {
       user.password= await bcrypt.hash(user.password,8) 
    }
    next()
})


userSchema.pre('remove',async function(next){
    const user=this
    await task.deleteMany({owner:user._id})
    next()
})
const user=mongoose.model('user',userSchema)

module.exports=user