const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {user} = require('../models/models')
const { Op } = require('sequelize')
const siteId = process.env.SITE_ID
const secretKey = process.env.SECRET_KEY
const hashSalt = 5

const generateJwt = (id, email, role, username) => {
    return jwt.sign(
        {id, email, role, username},
        secretKey,
        {expiresIn: '24h'}
    )
}

class userController {
    async registration(req, res, next) {
        try {
            const clientIp = req.ip
            const clientCookies = req.cookies;
            const {email, password, username = null} = req.body
            const hashPassword = await bcrypt.hash(password, hashSalt)
            const candidate = await user.findOne({
                where: {
                    [Op.or]: [{email}, {username}]
                }
            })

            if (candidate) {
                return next(ApiError.badRequest('User with this email or username already exists!'))
            }
            const candidateData = {email:email, username: email.split("@")[0], password: hashPassword,
                ip: clientIp, cookie: JSON.stringify(clientCookies), id_site: siteId}
            if (username) {
                candidateData.username = username
            }
            const {id} = await user.create(candidateData)
            const newUser = await user.findByPk(id)
            const token = generateJwt(newUser.id, newUser.email, newUser.role)
            // req.user.id = id
            res.json(token)
            next()
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message})
            next();
        }
    }

    async login(req, res, next){
        try {
            const {login, password} = req.body
            const userLogin = await user.findOne({
                where: {
                    [Op.or]: [{email: login}, {username: login}]
                }
            })
            if (!userLogin) {
                return next(ApiError.internal('User with this login was not found!'))
            }
            let comparePassword = bcrypt.compareSync(password, userLogin.password)
            if (!comparePassword) {
                return next(ApiError.internal('Password is incorrect!'))
            }
            const token = generateJwt(userLogin.id, userLogin.email, userLogin.role, userLogin.username)
            req.user.id = userLogin.id
            res.json(token)
            next()
        } catch (error) {
            console.error(error);
            res.status(500).json({message: error.message})
            next();
        }
    }

    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.username)
        res.json(token)
        next()
    }

    async getProfile(req, res, next) {
        const {id} = req.params

        if (id !== req.user.id ) {
            return next(ApiError.forbidden('Permission denied!'))
        }
        const userPage = await user.findByPk(id)
        res.json(userPage)
        next()
    }

    async updateProfile(req, res, next) {
        const {username, password, email } = req.body
        const oldPassword = (await user.findByPk(req.user.id)).password

        if (username) {
            await user.update({username}, {where:{id: req.user.id}})
        }
        if (email) {
            await user.update({email}, {where:{id: req.user.id}})
        }
        if (password) {
            let comparePassword = bcrypt.compareSync(password, oldPassword)
            if (comparePassword) {
                return next(ApiError.internal('The new password must be different from the old one!'))
            }
            const hashPassword = await bcrypt.hash(password, hashSalt)
            await user.update({password: hashPassword}, {where:{id: req.user.id}})
        }
        const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.username)
        return res.json(token)
    }
}

module.exports = new userController()