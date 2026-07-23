import express from 'express';
import appRouter from "./routers/index.js"
import {db_connection} from "./config/connection.js"
import cors from "cors";

const port = 8000;
const ORIGINS = ["http://localhost:5173"];
const app = express();

app.use(
    cors({
        origin:ORIGINS,
    })
)

app.use(express.json());

db_connection();

app.use("/api", appRouter);


app.listen(port,()=>{
    console.log("server runnig at http://localhost:"+port);
})