import 'dotenv/config'
import Jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"]

    if (!token) {
        return res.json({
            user: false,
            message: 'User Token Needed'
        })
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_KEY)
        req.user = decoded
    } catch (err) {
        return res.json({
            user: false,
            message: 'User Token Not Valid'
        })
    }
    return next()
}

export default verifyToken