import Users from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { secret } from '../config.js'
import color from 'colors'

export const checkAuth = async (req, res, next) => {
    try {
        if (req.method == 'OPTIONS') {
            next()
            return
        }
        const token = req.headers.authorization.split(' ')[1]
        if (!token) return res.status(403).json({message: "Пользователь не авторизован."})
    
        const decoded = jwt.verify(token, secret)
        const candidate = await Users.findOne({_id: decoded._id})
        if (!candidate) {
            return res.status(403).json({message: "Пользователь не авторизован."})
        } else {
            req.user = decoded
            next()
        }

    } catch (e) {
        // console.log(color.red(e))
        return res.status(403).json({message: "Пользователь не авторизован."})
    }
}

export default checkAuth