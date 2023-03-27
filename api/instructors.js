const Express = require('express')
const instructorsRouter = Express.Router()
const { getAllInstructors } = require('../db')

instructorsRouter.use((req, res, next)=> {
    console.log('A request has been made to /instructors')
    next()
})

instructorsRouter.get('/', async(req, res) => {
    try{
        const instructors = await getAllInstructors()
        res.send({success: true, instructors})
    } catch(error){
        res.send(error)
    }

})

module.exports = instructorsRouter