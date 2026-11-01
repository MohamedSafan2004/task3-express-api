import {Request , Response } from 'express'
import { getUserById,createUser,getAllUsers,updateUser,deleteUser } from '../services/userServices'


//controller to fetch all users
export const getUsers = (req: Request , res: Response)=>{
    const users = getAllUsers();
    res.status(200).json(users);
}


//controller to fetch user by id
export const getUser = (req:Request , res:Response)=>{
const id = Number(req.params.id);
const user = getUserById(id);
if (!user) {
    res.status(404).json({message: "User not found"});
    return;
}
res.status(200).json(user);
};


//controller to create user
export const adduser = (req: Request, res:Response )=>{
const name = req.body?.name;
if (!name || typeof name !== "string") {
    res.status(400).json({message: "Name is requerd"})
return
}
const newUser = createUser(name);
res.status(201).json(newUser)
};

//controller to update user
export const editUser = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const name = req.body?.name;

  if (!name || typeof name !== "string") {
    res.status(400).json({ message: "Name is required" });
    return;
  }

  const user = updateUser(id, name);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json(user);
};

//controller to delete user
export const removeUser = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = deleteUser(id);

  if (!deleted) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(204).send();
};