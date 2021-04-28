const mongoose=require('mongoose')


mongoose.connect(process.env.MONGODB_URL,
{
useNewUrlParser:true,
useCreateIndex:true,
useFindAndModify:false,
useUnifiedTopology:true
})







// task1.save().then(()=>{
//     console.log(task1)
// }).catch((error)=>{
//     console.log('Error',error)
// })
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error',error)
// })
