const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {user, generated_instance} = require('../models/models')

class mediaController {
    async media_upload(req, res, next) {
        try {
            const {token, url_link, type} = req.body
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            const {id} = decoded
            if (await user.findOne({where:{id:id}})) {
                const new_media_upload = await generated_instance.create({url_link, type, id_user: id})
                res.json(new_media_upload)
            } else {return next(ApiError.badRequest('User not found!'))}
        } catch (e) {
           res.json(e.message)
        }
    }
}

module.exports = new mediaController()