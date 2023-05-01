const { client } = require('../client.js')

async function createNewClassroom({name, inSession}){
    const { rows: [ newClass ]} = await client.query(`
        INSERT INTO classrooms(name, "inSession")
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `, [name, inSession])
    return newClass
}

async function enrollStudent({classroomId, studentId}){
    const { rows: [ newEnrollment ]} = await client.query(`
        INSERT INTO "classEnrollment"("classroomId", "studentId")
        VALUES ($1, $2)
        ON CONFLICT ("classroomId", "studentId") DO NOTHING
        RETURNING *;
    `, [classroomId, studentId])
    return newEnrollment
}

module.exports = {
    createNewClassroom,
    enrollStudent
}

/*
INSERT INTO instructors(username, password, "isAdmin", email) VALUES ($1, $2, $3, $4)
ON CONFLICT (username) DO NOTHING 
RETURNING id, username, "isAdmin"

*/