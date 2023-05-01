module.exports = {
    ...require('./database_functions/instructors'),
    ...require('./database_functions/students'),
    ...require('./database_functions/classrooms')
}