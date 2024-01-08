import { Router } from "express";
import controller from '../controllers/appController.js'
import checkAuth from '../middleware/checkAuth.js'
import { body } from 'express-validator'

const router = new Router()

router.get('/getTasks', checkAuth, controller.getTasks)
router.post('/newTask', [body('name').notEmpty()], checkAuth, controller.newTask)
router.patch('/patchTask/:id', [body('name').notEmpty()], checkAuth, controller.patchTask)
router.delete('/deleteTask/:id', checkAuth, controller.deleteTask)
router.post('/subscribe', checkAuth, controller.subscribe)

export default router