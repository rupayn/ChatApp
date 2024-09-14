import appRouter from "./src/app.js"
import express  from "express"
const app = express()

app.use(express.json())
app.use("/api/auth",appRouter)
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(process.env.PORT,()=>{
    console.log(`listening on ${process.env.PORT}`)
})