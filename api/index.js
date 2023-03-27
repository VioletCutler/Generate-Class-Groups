const Express = require('express');
const router = Express.Router();
const { client } = require('../db/client')
require('dotenv').config()
const { JWT_SECRET } = process.env


router.use('*', (req, res, next)=> {
    console.log('a request is being made to the API router')
    next()
})

router.use('/health', async (req, res, next)=>{
    try{
        const uptime = process.uptime();
        // const {rows: [dbConnection]} = await client.query(`SELECT NOW();`)
        console.log('line 14')
        const currentTime = new Date()
        const lastRestart = new Intl.DateTimeFormat('en', {timestyle: 'long', dateStyle: 'long', timeZone: 'America/New_York'}).format(currentTime - (uptime * 1000))
        res.send({message: 'healthy', uptime, currentTime, lastRestart})
    }catch(error){
        next(error)
    }
})

// router.use(async(req, res, next)=> {
//     console.log('authorization middleware')
//     const auth = req.headers('Authorization')
//     const prefix = 'Bearer '
//     if (auth) {
//         const token = auth.slice(prefix)
//         const isValidToken = jwt.verify(token, JWT_SECRET)
//     }
//     next()
// })

const instructorsRouter = require('./instructors')
router.use('/instructors', instructorsRouter)

module.exports = router