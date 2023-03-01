const ApiError = require('../error/ApiError')
class validationUser {

    static validateLoginRequest(req, res, next) {
        const {login, password} = req.body;
        if (!login || !password) {
            return next(ApiError.internal('Login or password is incorrect!'));
        }
        return next();
    }

    static validateRegistrationRequest(req, res, next) {
        const { email, password } = req.body;
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!email || !password) {
            return next(ApiError.badRequest('Incorrect login or password!'));
        }
        if (!regex.test(password)) {
            return next(ApiError.badRequest('Password should contain at least 8 characters, including lowercase and uppercase letters, numbers, and special characters.'));
        }
        return next();
    }

    static async validateUpdateProfileRequest(req, res, next) {
        try {
            const { account } = req.params;
            if (account !== req.user.username) {
                throw ApiError.forbidden('Permission denied!');
            }

            const { username, password, email } = req.body;

            if (!username && !email && !password) {
                throw ApiError.badRequest('You must provide at least one field to update!');
            }

            if (password) {
                const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
                if (!regex.test(password)) {
                    throw ApiError.badRequest(
                        'Password should contain at least 8 characters, including lowercase and uppercase letters, numbers, and special characters.'
                    );
                }
            }
            return next();
        } catch (e) {
            return next(e);
        }
    }


}
module.exports = validationUser