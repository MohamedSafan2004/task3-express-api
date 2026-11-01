import  express from "express";
import route from "./routes/userRoutes";
import { requestLogger } from "./middleware/requestLogger";
const app = express();
app.use(express.json());

app.use(requestLogger);
app.use("/api/users",route);


app.listen(3000, ()=>{
    console.log("server is Running")
})