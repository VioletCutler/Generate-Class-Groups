const { client } = require("../client.js");

// Create New Classroom
async function createNewClassroom({ name, inSession = true }) {
  try {
    const {
      rows: [newClass],
    } = await client.query(
      `
        INSERT INTO classrooms(name, "inSession")
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
    `,
      [name, inSession]
    );
    return newClass;
  } catch (error) {
    throw error;
  }
}

// Enroll Student in Class
async function enrollStudent({ classroomId, studentId }) {
  try {
    const {
      rows: [enrolledStudent],
    } = await client.query(
      `
        INSERT INTO "classEnrollment"("classroomId", "studentId")
        VALUES ($1, $2)
        ON CONFLICT ("classroomId", "studentId") DO NOTHING
        RETURNING *;
    `,
      [classroomId, studentId]
    );
    return enrolledStudent;
  } catch (error) {
    throw error;
  }
}

// Unenroll Student [delete from classEnrollment]
async function unenrollStudent({ studentId }) {
  try {
    const {
      rows: [unenrolledStudent],
    } = await client.query(
      `
        DELETE FROM "classEnrollment"
        WHERE "studentId"=$1
        RETURNING *;
    `,
      [studentId]
    );
    return unenrolledStudent;
  } catch (error) {
    throw error;
  }
}

//Add class to instructor
async function addInstructorToClass({ classroomId, instructorId }) {
  try {
    const {
      rows: [instructorsClass],
    } = await client.query(
      `
          INSERT INTO "instructorsClasses"("instructorId", "classroomId")
          VALUES ($1, $2)
          ON CONFLICT ("instructorId", "classroomId") DO NOTHING
          RETURNING *;
      `,
      [instructorId, classroomId]
    );

    return instructorsClass;
  } catch (error) {
    throw error;
  }
}

//Remove instructor from class
async function removeInstructorFromClass({ classroomId, instructorId }) {
  try {
    const {
      rows: [instructorsClass],
    } = await client.query(
      `
              DELETE FROM instructorsClasses
              WHERE "classroomId"=$1 AND "instructorId"=$2
              RETURNING *;
          `,
      [classroomId, instructorId]
    );

    return instructorsClass;
  } catch (error) {
    throw error;
  }
}

// Get Classroom by Id
async function getClassroomById({ id }) {
  // Grab the classroom as well as the instructors and students
  try {

    const {rows: [classroom]} = await client.query(`
      SELECT classrooms.name
      FROM "classrooms"
      WHERE id=$1;
    `, [id])
    // get students
    const students = await client.query(
      `
        SELECT classrooms.*, "classEnrollment".*,  students.name
        FROM "classrooms"
        JOIN "classEnrollment" on "classEnrollment"."classroomId" = classrooms.id
        JOIN "students" on "classEnrollment"."studentId" = students.id
        WHERE classrooms.id=$1;
        `,
      [id]
    );

    const instructors = await client.query(`
    SELECT instructors.name, instructors.username
    FROM "classrooms"
    JOIN "instructorsClasses" on "instructorsClasses"."classroomId" = classrooms.id
    JOIN "instructors" on "instructorsClasses"."instructorId" = instructors.id
    WHERE classrooms.id=$1;
    `, [id])

    const classRoom = {
      classroom: classroom,
      instructors: instructors.rows,
      students: students.rows
    }

    return classRoom;
  } catch (error) {
    throw error;
  }
}

// ========== These are related to the query above ^ ==================
// Get Instructors by Classroom Id
// async function getInstructorsByClass({id}){
//     const { rows } = await client.query(`

//     `)
// }

// Get All Students by ClassroomId

//================================================================

// Get Classrooms by Instructor
async function getClassroomsByInstructorId({ instructorId }) {
  try {
    const { rows } = await client.query(
      `
        SELECT "instructorsClasses".*, classrooms.*
        FROM "instructorsClasses"
        JOIN classrooms ON "classroomId"=classrooms.id
        WHERE "instructorId"=$1;
    `,
      [instructorId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

// Update Classroom

module.exports = {
  createNewClassroom,
  enrollStudent,
  unenrollStudent,
  addInstructorToClass,
  removeInstructorFromClass,
  getClassroomById,
  getClassroomsByInstructorId,
};

/*
INSERT INTO instructors(username, password, "isAdmin", email) VALUES ($1, $2, $3, $4)
ON CONFLICT (username) DO NOTHING 
RETURNING id, username, "isAdmin"

*/
