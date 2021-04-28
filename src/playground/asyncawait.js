require('../db/mongoose')
const task=require('../models/tasks')
const users = require('../models/users')




// const findbyidandupdate=async(id,age)=>{
//     const user=await users.findByIdAndUpdate(id,{age})
//     return {user,message:'sucessfully Updated!!'}
// }

// findbyidandupdate('607fc8ee56c5a20e400a27f4',23).then((result)=>{
//     console.log('User ',result.user.name +'Message :'+result.message)
// }).catch((e)=>{
//     console.log('Error :',e)
// })


// const findbynameandupdateage=async(name,age)=>{
//     const user=await users.findOneAndUpdate({name},{age})
//     return {user,message:'Updated Sucessflly!!'}
// }

// findbynameandupdateage('sonali',23).then((result)=>{
//     console.log('Name is :',result.user.name+ ' age Updated Sucessfully!!',result.message)
// }).catch((e)=>{
//     console.log('Error ',e)
// })


const deletandcount=async(description)=>{
    const tasks=await task.findOneAndRemove({description})
    const count=await task.countDocuments({completion:false})
    return {tasks,count}
}

deletandcount('rsolve rcovery problem').then((result)=>{
    console.log('Task is :'+result.tasks.description+' Is Removed Sucessfully!!!')
    console.log('Count of Unfinished Tasks are :'+result.count)
}).catch((e)=>{
    console.log(e)
})