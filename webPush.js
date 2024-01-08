import webPush from 'web-push'
import { PRIVATEKEY, PUBLICKEY } from './config.js'
import Users from './models/userModel.js'
import Tasks from './models/taskModel.js'

export const startCheckTasks = async () => {
    webPush.setVapidDetails(
        "mailto: <rutuchenal37@gmail.com>",
        PUBLICKEY,
        PRIVATEKEY
    )

    setInterval(async () => {
        const users = await Users.find()

        users.forEach(async user => {
            if (user.deviceId) {
                user.tasks.forEach(async taskid => {
                    const task = await Tasks.findById(taskid)
                    const curTime = new Date().getTime()
                    if (!task.isDone && 0 <= task.start - curTime && task.start - curTime <= 15 * 60 * 1000 && !task.isNotificatedStart) {
                        await task.updateOne({ isNotificatedStart: true })
                        await task.save()
                        await webPush
                            .sendNotification(
                                user.deviceId,
                                JSON.stringify({
                                    title: "До начала задачи осталось меньше 15 минут",
                                    body: "Задача: " + task.name
                                })
                            )
                            .catch(err => {
                                console.log(err)
                            })
                    } else if (!task.isDone && 0 <= task.end - curTime && task.end - curTime <= 15 * 60 * 1000 && !task.isNotificatedEnd) {
                        await task.updateOne({ isNotificatedEnd: true })
                        await task.save()
                        await webPush
                            .sendNotification(
                                user.deviceId,
                                JSON.stringify({
                                    title: "До конца задачи осталось меньше 15 минут",
                                    body: "Задача: " + task.name
                                })
                            )
                            .catch(err => {
                                console.log(err)
                            })
                    }
                })
            }

        })
    }, 1000 * 60)
}



