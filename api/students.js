const Express = require('express')
const studentsRouter = Express.Router()
const { getAllStudents, getStudentsByInstructor, updateStudent, getStudentById } = require('../db')
const ApiError = require('./error/ApiError')

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

studentsRouter.get('/:instructorId', async(req, res, next) => {
    try{
        const { instructorId } = req.params
        const students = await getStudentsByInstructor(instructorId)
    res.send({success: true, students})
    } catch (error){
        console.log(error)
        next({message: 'error'})
    }
})

studentsRouter.patch('/:studentId', async(req, res, next) => {
    try{
        const { studentId } = req.params
        const { name, classroom, instructorsId } = req.body

        const studentToUpdate = await getStudentById(studentId)
        if (!studentToUpdate){
            next(ApiError.badRequest('No student to update'))
        }

        const updateObject = {}
        if (name) updateObject.name = name;
        if (classroom) updateObject.classroom = classroom;
        if (instructorsId) updateObject.instructorsId = instructorsId

        const updatedStudent = await updateStudent(id, updateObject)
        res.send({success: true, updatedStudent})

    } catch (error) {
        next({ message: 'There was an error updating the student'})
    }
})

module.exports = studentsRouter