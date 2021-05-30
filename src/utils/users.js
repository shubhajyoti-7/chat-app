const users = []

const addUser = ({id,username,roomname})=>{

     username = username.trim().toLowerCase()
     roomname = roomname.trim().toLowerCase()

    if(!username || !roomname)
    {
        return {
            error:'Could not get username and roomname'
        }
    }

    const isUnique = users.find((user)=>{
        return user.username === username && user.roomname === roomname
    })

    if(isUnique)
    {
        return{
            error:'Username already in use!'
        }
    }
    users.push({id,username,roomname})
    return {user:{id,username,roomname}}
}

// addUser({
//     id:22,username:'Shubha',roomname:'Kalyani'
// })
// console.log(users)
// const res= addUser({
//     id:22,username:'Hello',roomname:'Kalyani'
// })
// console.log(res)


const removeUser = (id)=>{

    const index = users.findIndex((user)=>user.id === id)
    if(index == -1)
    {
        return{
            error : 'No user by this id'
        }
    }
    const delUser = users.splice(index,1)[0]
    return {user:delUser}

}

// console.log(removeUser(21))
// console.log(users)


const readUser = (id)=>{
    return users[users.findIndex((user)=> user.id === id)]
}

//JS doesnt have segmentation fault on array index out of bounds
// instead it returns undefined

const readUsersRoom = (roomname)=>{

    return users.filter((user)=>user.roomname === roomname)
}

// console.log(readUser(100))
// console.log(readUsersRoom('kalyani'))

module.exports = {
    addUser,
    removeUser,
    readUser,
    readUsersRoom
}