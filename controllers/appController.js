import Users from '../models/userModel.js'
import Tasks from '../models/taskModel.js'
import { validationResult } from 'express-validator'
import color from 'colors'

class AppController {
    async newTask(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({ message: errors })

            const user_id = req.user._id
            const { name, description, start, end } = req.body
            const user = await Users.findById(user_id)

            const task = new Tasks({ name, description, start, end, isDone: false })
            await user.updateOne({ $push: { tasks: task } })
            const response = await task.save()

            return res.status(200).json(response)

        } catch (e) {
            console.log(color.red(e))
            res.status(500).send({ message: "Ошибка на сервере." })
        }
    }

    async getTasks(req, res) {
        try {
            const user_id = req.user._id
            const user = await Users.findById(user_id)
            const tasks = await Promise.all(
                user.tasks.map(async (taskid) => {
                    return await Tasks.findById(taskid)
                })
            )

            return res.status(200).json({ tasks })
        } catch (e) {
            console.log(color.red(e))
            res.status(500).send({ message: "Ошибка на сервере." })
        }
    }

    async patchTask(req, res) {
        try {
            const task_id = req.params.id
            const task = await Tasks.findById(task_id)
            await task.updateOne(req.body)
            const response = await task.save()
            return res.status(200).json({ ...response._doc, ...req.body })

        } catch (e) {
            console.log(color.red(e))
            res.status(500).send({ message: "Ошибка на сервере." })
        }
    }

    async deleteTask(req, res) {
        try {
            const user_id = req.user._id
            const task_id = req.params.id
            const user = await Users.findById(user_id)

            await user.updateOne({ $pull: { tasks: task_id } })
            user.save()
            await Tasks.findOneAndDelete({ _id: task_id })
            return res.status(200).json({ message: "Заметка успешно удалена." })

        } catch (e) {
            console.log(color.red(e))
            res.status(500).send({ message: "Ошибка на сервере." })
        }
    }

    async subscribe(req, res) {
        try {
            const user_id = req.user._id
            const user = await Users.findById(user_id)

            await user.updateOne({deviceId: req.body})
            await user.save()

            res.status(200).send(req.body)
        } catch (e) {
            console.log(color.red(e))
            res.status(500).send({ message: "Ошибка на сервере." })
        }
    }
}

export default new AppController()