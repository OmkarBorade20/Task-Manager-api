const mongoose=require('mongoose')


const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completion:{
        type:Boolean,
        default:false,
        trim:true
    },
    owner:{
            type:mongoose.Schema.Types.ObjectID,
            required:true,
            ref:'user'
        }  
},{timestamps:true})
const task=mongoose.model('Task',taskSchema)



module.exports=task