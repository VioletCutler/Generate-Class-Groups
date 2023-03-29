const Express = require('express')
const studentsRouter = Express.Router()
const { getAllStudents } = require('../db/students')

studentsRouter.use((req, res, next)=>{
    console.log('A request has been made to the students router')
    next()
})

studentsRouter.get('/', async(req, res) => {
    try{
        const students = await getAllStudents()
    res.send({success: true, students})
    } catch (error){
        next({message: 'error'})
    }
})

module.exports = studentsRouter