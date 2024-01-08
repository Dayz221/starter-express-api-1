import color from 'colors'
import Users from '../models/userModel.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import { secret } from '../config.js'
import jwt from 'jsonwebtoken'

class AuthController {
    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

            const { login, password } = req.body
            const log = await Users.findOne({ "login": login })
            if (log) return res.status(400).send({ message: "Такое имя пользователя уже используется." })

            const hashedPassword = bcrypt.hashSync(password, 8)
            const user = new Users({ login, password: hashedPassword })
            
            const token = jwt.sign({
                _id: user._id
            }, secret, {expiresIn: "336h"})

            await user.save()
            return res.status(200).json({ token, message: "Пользователь успешно зарегистрирован" })

        } catch (err) {
            console.log(color.red(err))
            res.status(500).send({ message: "Ошибка при регистрации. Попробуйте позже." })
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body
            const candidate = await Users.findOne({login})
            if (!candidate) return res.status(400).send({ message: "Неправильный логин или пароль." })

            const validPassword = bcrypt.compareSync(password, candidate.password)
            if (!validPassword) return res.status(400).send({ message: "Неправильный логин или пароль." })

            const token = jwt.sign({
                _id: candidate._id
            }, secret, {expiresIn: "336h"})

            return res.status(200).send({ token, message: "Пользователь успешно авторизован." })

        } catch (err) {
            console.log(color.red(err))
            res.status(500).send({ message: "Ошибка при входе. Попробуйте позже." })
        }
    }

    async me(req, res) {
        try {
            const candidate = await Users.findById(req.user._id)
            return res.status(200).json({id: candidate._id})

        } catch (e) {
            return res.status(500).json({message: "Ошибка на сервере. Попробуйте позже."})
        }
    }
}

export default new AuthController()