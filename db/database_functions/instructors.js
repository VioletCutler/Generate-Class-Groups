const { client } = require("../client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;
const { deleteStudent } = require('./students.js')
const { getInstructorsByClassroomId,  getStudentsByClassroomId, getClassroomById, deleteClassroom, removeInstructorFromClass } = require('./classrooms.js')

// Create Instructor

async function createInstructor({ name, username, password, isAdmin = false, email, isActive = true }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  const hashedEmail = await bcrypt.hash(email, SALT_COUNT)
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO instructors(name, username, password, "isAdmin", email, "isActive") VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, name, username, "isAdmin", "isActive"
      `,
      [name, username, hashedPassword, isAdmin, hashedEmail, isActive]
    );
    console.log('create user DB function:', user)
    return user;
  } catch (error) {
    throw error;
  }
}

// Get Instructor
async function loginInstructor({ username, password }) {
 
  if (!username || !password) return;
  try {
    const instructor = await getInstructorByUsername({username});
    if (!instructor) return;
    const hashedPassword = instructor.password
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete instructor.password
    return instructor;
  } catch (error) {
    throw error;
  }
}

// Get Students by Instructor
async function getStudentsByInstructor({id}) {
  try {
    const { rows } = await client.query(`
    SELECT students.* FROM "students"
    JOIN "classEnrollment" ON "studentId" = students.id
    JOIN "classrooms" ON "classEnrollment"."classroomId" = classrooms.id
    JOIN "instructorsClasses" ON "instructorsClasses"."classroomId" = classrooms.id
    JOIN instructors ON "instructorId" = instructors.id
    WHERE instructors.id=${id};
`);
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get Instructor by Username
async function getInstructorByUsername({username}) {
  try {
    console.log('line 63 instructors')
    const {
      rows: [instructor],
    } = await client.query(
      `
      SELECT instructors.id, instructors.name, instructors.username, instructors."isAdmin", instructors."isActive", instructors.password
      FROM "instructors"
      WHERE username = $1;
    `,
      [username]
    );
      if (instructor){
        return instructor
      } else {
        return undefined
      }
  } catch (error) {
    throw error;
  }
}

async function getInstructorByEmail({email}){
  try {
    //This function is currently broken because emails are encrypted

    const {rows: [instructor]} = await client.query(`
      SELECT * 
      FROM instructors
      WHERE email = $1;
    `,[email])

    console.log('Should not be undefined:',instructor)
    if (instructor){
      console.log('Should not be seeing this')
      return instructor
    } else {
      return undefined
    }
  } catch (error) {
    throw error
  }
}

// Get All Instructors
async function getAllInstructors() {
  try {
    const { rows } = await client.query(`
        SELECT id, username, "isAdmin"
        FROM "instructors"
      `);

    return rows;
  } catch (error) {
    throw error;
  }
}

// Get Instructor by Id
async function getInstructorById({id}){
  try{
    const { rows: [instructor] } = await client.query(`
        SELECT id, username, "isAdmin"
        FROM "instructors"
        WHERE id=$1
    `, [id])
    if (instructor){
      return instructor
    } else {
      return undefined
    }
  } catch(error){
    throw error
  }
}


//Update instructor
async function updateInstructor(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    if (setString.length > 0){

    
    const { rows: [instructor] } = await client.query(
      `
            UPDATE instructors
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `, 
        Object.values(fields)
    );
    
    return instructor;
    }
  } catch (error) {
    throw error;
  }
}


//Deactivate account
async function deactivateAccount({id}){
  try{
    const { rows: [instructor] } = await client.query(`
        UPDATE instructors
        SET "isActive"=false
        WHERE id=$1
        RETURNING instructors.id, instructors.name, instructors.username, instructors."isAdmin", instructors."isActive";
    `, [id])
    return instructor
  } catch(error){
    throw error
  }
}


/*
 Delete instructor permanently */
async function deleteInstructor({instructorId}){
  try {
    // Are you sure you want to delete your account?
    // Doing so will delete all classrooms and students that are
    // only associated with your account


    // Grab a list of classrooms associated with this instructor
    const classrooms = await client.query(`
    SELECT "instructorsClasses".*, classrooms.*
    FROM "instructorsClasses"
    JOIN classrooms ON "classroomId"=classrooms.id
    WHERE "instructorId"=$1;
    `, [instructorId])

    await removeInstructorFromClasses({instructorId, classrooms: classrooms.rows})

    const { rows: [instructor]} = await client.query(`
      DELETE FROM instructors
      WHERE id=$1
      RETURNING instructors.name, instructors.username, instructors.email;
    `, [instructorId])

    return instructor ? instructor : undefined;

  } catch (error) {
    throw error
  }
}

async function removeInstructorFromClasses({instructorId, classrooms}){
  try{
     await Promise.all(classrooms.map(async (classroom) => {
      const instructors = await getInstructorsByClassroomId({id: classroom.id})

      //Delete the association of this instructor with this classroom
      await removeInstructorFromClass({classroomId: classroom.id, instructorId: instructorId})

      //if there are no other instructors associated with the classroom,
      //delete the students, then the classroom
      if (instructors.length === 1){
        //Delete Students
        const students = await getStudentsByClassroomId({id: classroom.id});
        const deletedStudents = await Promise.all(students.map((student) => deleteStudent({id: student.id})))

        //Delete Classroom
        const deletedClassroom = await deleteClassroom({id: classroom.id})
      }
    }))
  } catch(error){
    throw error;
  }
}

/*
  -- Grab a list of classrooms associated with this instructor
  -- Check to see if there are any other instructors associated with each of those classrooms
      -- If yes, then don't delete the classroom or the associated students, just delete
      the instructor
  -- If not, then grab all the students associated with those classrooms and delete them.
  -- Then delete the classrooms and finally the instructor 
*/

module.exports = {
  createInstructor,
  getAllInstructors,
  loginInstructor,
  getInstructorByUsername,
  getInstructorById,
  getStudentsByInstructor,
  deactivateAccount,
  updateInstructor,
  deleteInstructor,
  getInstructorByEmail
};
