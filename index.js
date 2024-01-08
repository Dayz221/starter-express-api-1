import express from 'express'
import color from 'colors'
import mongoose from 'mongoose'
import { logger } from './middleware/logger.js'
import authRouter from './appRoutes/authRoutes.js'
import appRouter from './appRoutes/appRoutes.js'
import cors from 'cors'
import {startCheckTasks} from './webPush.js'


mongoose
    .connect('mongodb+srv://admin:qwerty123@cluster0.aiz62xa.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log(color.yellow('MongoDB joined')))
    .catch((err) => console.log(color.red(err)))

const PORT = process.env.port || 8000
const app = express()

app.use(express.json())
app.use(logger)
app.use(cors())
app.use('/api/auth', authRouter)
app.use('/api', appRouter)
startCheckTasks()

app.listen(PORT, (err) => {
    if (err) {
        console.log(color.red(err))
        return
    }

    console.log(color.yellow(`Server started on http://localhost:${PORT}`))
})