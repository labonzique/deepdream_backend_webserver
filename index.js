require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const cors = require('cors')
const router = require('./routers/index')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser');
const path = require('path')
const errorHandler = require('./middleware/ErrrorHandlingMiddleware')

const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(process.cwd(), "static")))
app.use(cookieParser());
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler)

const start = async ()=> {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true, force:true})
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()