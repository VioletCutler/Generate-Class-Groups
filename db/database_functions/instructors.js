const { client } = require("../client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

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
    return user;
  } catch (error) {
    throw error;
  }
}

// Get Instructor
async function getInstructor({ username, password }) {
 
  if (!username || !password) return;
  try {
    const instructor = await getInstructorByUsername(username);
    if (!instructor) return;
    const hashedPassword = instructor.password
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    return instructor;
  } catch (error) {
    throw error;
  }
}

// Get Students by Instructor
async function getStudentsByInstructor({id}) {
  try {
    console.log('getStudentsByInstructor:',id)
    const { rows } = await client.query(`
    SELECT * FROM "students"
    WHERE "instructorId"=${id};
`);
    console.log(rows)
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get Instructor by Username
async function getInstructorByUsername({username}) {
  try {
    const {
      rows: [instructor],
    } = await client.query(
      `
      SELECT *
      FROM "instructors"
      WHERE username = $1;
    `,
      [username]
    );

    if (instructor) {
      instructor.students = await getStudentsByInstructor(instructor.id);
      return instructor;
    } else {
      return undefined;
    }
  } catch (error) {
    throw error;
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
    return instructor
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
        SET "isActive"='false'
        WHERE id=$1
        RETURNING *;
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
    const { rows: [classrooms] } = await client.query(`
    SELECT "instructorsClasses".*, classrooms.*
    FROM "instructorsClasses"
    JOIN classrooms ON "classroomId"=classrooms.id
    WHERE "instructorId"=$1;
    `, [id])
  } catch (error) {
    throw error
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
  getInstructor,
  getInstructorByUsername,
  getInstructorById,
  getStudentsByInstructor,
  deactivateAccount,
  updateInstructor,
  deleteInstructor
};
