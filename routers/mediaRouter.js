const Router = require('express')
const router = new Router()
const mediaController = require('../controllers/mediaController')

router.post('/upload', mediaController.media_upload)

module.exports = router
