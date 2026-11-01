import { Router } from "express";
import { getUser, adduser,getUsers,editUser,removeUser} from "../controllers/usercontrollers";
import { requireAPIKey } from "../middleware/requireAPIKey";
const route = Router();

route.get('/',getUsers);
route.get('/:id',getUser);
route.post("/",requireAPIKey,adduser);
route.put('/:id',requireAPIKey,editUser)
route.delete('/:id',requireAPIKey,removeUser)

export default route;