const Express = require('express');
const router = Express.Router();
const { client } = require('../db/client')
require('dotenv').config()
const { JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const { getInstructorById } = require('../db')


// router.use('*', (req, res, next)=> {
//     console.log('a request is being made to the API router')
//     next()
// })

router.use('/health', async (req, res, next)=>{
    try{
        const uptime = process.uptime();
        // const {rows: [dbConnection]} = await client.query(`SELECT NOW();`)
        const currentTime = new Date()
        const lastRestart = new Intl.DateTimeFormat('en', {timestyle: 'long', dateStyle: 'long', timeZone: 'America/New_York'}).format(currentTime - (uptime * 1000))
        res.send({message: 'healthy', uptime, currentTime, lastRestart})
    }catch(error){
        next(error)
    }
})

router.use(async(req, res, next)=> {
    const auth = req.header('Authorization')
    try {
        const prefix = 'Bearer '
        if (auth) {
            const token = auth.slice(prefix)
            const { id } = jwt.verify(token, JWT_SECRET)
            if(!id){
                next()
            } else {
                const instructor = await getInstructorById(id)
                req.instructor = instructor
                next()
            }
        } else {
            next()
        }
    } catch(error){
        throw error
    }
})

router.get('/user', (req, res, next)=>{
    try{
    res.send({success: true})
    } catch (error){
        next(error)
    }
  
})
const instructorsRouter = require('./instructors')
router.use('/instructors', instructorsRouter)
const studentsRouter = require('./students')
router.use('/students', studentsRouter)

module.exports = router