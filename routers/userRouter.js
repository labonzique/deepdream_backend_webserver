const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const userVal = require("../validators/validationUser")
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/registration', userVal.validateRegistrationRequest, userController.registration)
router.post('/login', userVal.validateLoginRequest, userController.login)
router.get('/auth', checkRole('user'), userController.check)
router.get('/:id', checkRole('user'), userController.getProfile)
router.patch('/:id', checkRole('user'), userVal.validateUpdateProfileRequest, userController.updateProfile)


module.exports = router
