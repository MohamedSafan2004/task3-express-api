interface user{
id: number,
name: string, 
}

let nextId = 4; 

//mock database
const users : user[]=[
    {id: 1 , name:"mohamed"},
    {id: 2 , name:"ali"},
    {id: 3 , name:"kareem"}
];

//fetch all users
export const getAllUsers = ():user[]=>{
return users;
}

//feth user by Id
export const getUserById = (id:number): user | undefined=>{
return users.find((user)=> user.id ===id);
};

//creat and add user to database 
export const createUser = (name: string):user=>{
const newUser:user ={id: nextId , name:name};
nextId++ 
users.push(newUser)
return newUser;
}


//update user by id
export const updateUser = (id: number, name: string): user | undefined => {
  const found = users.find((u) => u.id === id);
  if (!found) {
    return undefined;
  }
  found.name = name;
  return found;
};

//delete user by id (returns true if a user was deleted, false if the id does not exist)
export const deleteUser = (id: number): boolean => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  return true;
};