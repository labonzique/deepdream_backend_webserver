const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const mediaRouter = require('./mediaRouter')

router.use('/user', userRouter)
router.use('/media', mediaRouter)

module.exports = router