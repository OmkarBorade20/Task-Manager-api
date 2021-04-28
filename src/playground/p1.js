require('../db/mongoose')
const task=require('../models/tasks')
const users = require('../models/users')

const t=new task({description:'rsolve rcovery problem',completion:true})

// t.save().then((t)=>{
//     console.log (t)
// })

//promise chaining

// task.deleteOne({_id:'607fc25dca15d106c4e5ed51'}).then(()=>{
//     console.log('removed')
//     return task.findOne({completion:true})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })


//asynawait

//  const findbyidandcount=async(id,age)=>{
//    const user=await users.findById(id)
//     const count=await users.countDocuments({age})
//     return {user,count}
// }

// const id='607fc8dc56c5a20e400a27f3'
// findbyidandcount(id,0).then((result)=>{
//     console.log('User is:'+result.user)
//     console.log('count is:'+result.count)
// }).catch((e)=>{
//     console.log('e'+e)
// })

