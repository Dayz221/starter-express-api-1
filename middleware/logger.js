import color from 'colors'

export const logger = (req, res, next) => {
    const date = new Date()
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    console.log(color.green(`[${time}] ${req.method} ${req.url}`))
    next()
}