const Express = require('express');
const classroomsRouter = Express.Router();
const {
    requireAuthorization
} = require('./utils/utils')
const {
    createNewClassroom,
    addInstructorToClass,
    getClassroomByName
} = require('../db')
const ApiError = require('./error/ApiError')

classroomsRouter.use((req, res, next) => {
    console.log('A request has been made to the classrooms router');
    next();
})

classroomsRouter.post('/', requireAuthorization, async (req, res, next) => {
    const { classroomName, inSession } = await req.body
    /*
    When creating a new classroom:
    - Create Classroom
    - Add Instructor to Classroom
    */
    //see if there is already a classroom by that name
    try {
        const _classroom = await getClassroomByName({classroomName})

        if (_classroom){
            next(ApiError.badRequest('A classroom by that name already exists'));
        } else {
            //create new classroom
            const newClassroom = await createNewClassroom({name: classroomName, inSession})

            //add instructor to newly created classroom
            await addInstructorToClass({classroomId: newClassroom.id, instructorId: req.instructor.id})
        
            console.log('classrooms router POST /')
            res.send({success: true})
        }
    } catch (error) {
        throw error
    }
})

module.exports = classroomsRouter