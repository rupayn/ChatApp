import appRouter from "./src/app.js"
import express  from "express"
import { connectDb } from "./src/utils/ConnectDb.ts"
import dotenv from "dotenv";

dotenv.config({
    path:"./.env"
});
const app = express()

app.use(express.json())
const dbUrl =process.env.DBURL 
if(dbUrl)
connectDb(dbUrl);

app.use("/api/auth",appRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(process.env.PORT,()=>{
    console.log(`listening on ${process.env.PORT}`)
})