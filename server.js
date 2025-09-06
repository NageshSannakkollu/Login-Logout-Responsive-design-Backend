const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const userInfo = require("./routes/auth")

const port = 3036 || process.env.PORT;

app.use("/",userInfo)

app.listen(port,(() => {
    console.log(`Server Running at: http://localhost:${port}/`)
}))