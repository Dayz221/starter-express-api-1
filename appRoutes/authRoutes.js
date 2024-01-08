import { Router } from "express";
import controller from '../controllers/authController.js'
import checkAuth from '../middleware/checkAuth.js'
import { body } from 'express-validator'

const router = new Router()

router.post('/register', [
    body('login', "Логин не может быть пустым").notEmpty(),
    body('password', "Размер пароля должен быть от 4 до 20 символов").isLength({ min: 4, max: 20 })
], controller.register)
router.post('/login', controller.login)
router.get('/me', checkAuth, controller.me)

export default router