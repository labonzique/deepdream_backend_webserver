const jwt = require('jsonwebtoken')

module.exports = (role) => (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
        }
        if(role !== 'all') {
            try {
                const token = req.headers.authorization.split(' ')[1]
                if (!token) {
                    return res.status(401).json({message: 'Not authorized!'})
                }
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                if (decoded.role !== role && decoded.role !== 'admin') {
                    return res.status(403).json({message: "Permission denied!"})
                }
                req.user = decoded
                next()
            } catch (e) {
                res.status(401).json({message: 'Not authorized!'})
            }
        } else {
            try {
                const token = req.headers.authorization?.split(' ')[1]
                if (token) {
                    req.user = jwt.verify(token, process.env.SECRET_KEY)
                }
                next()
            } catch (e) {res.status(500).json(e.message)}
        }
}



