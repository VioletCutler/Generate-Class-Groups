const { client } = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createInstructor({ username, password, isAdmin }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO instructors(username, password, "isAdmin") VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, username, "isAdmin"
      `,
      [username, hashedPassword, isAdmin]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

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

async function getStudentsByInstructor(id) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM "students"
    WHERE "instructorId"=${id};
`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getInstructorByUsername(username) {
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

async function getAllInstructors() {
  try {
    const { rows } = await client.query(`
        SELECT id, username, "isAdmin"
        FROM "instructors"
      `);
    for (let instructor of rows) {
      instructor.students = await getStudentsByInstructor(instructor.id);
    }
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getInstructorById(id){
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

module.exports = {
  createInstructor,
  getAllInstructors,
  getInstructor,
  getInstructorByUsername,
  getInstructorById
};
