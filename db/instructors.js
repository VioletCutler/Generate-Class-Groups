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
        INSERT INTO instructors(username, password, isAdmin) VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING 
        RETURNING id, username, isAdmin
      `,
      [username, hashedPassword, isAdmin]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getStudentsByInstructor(id) {
  const { rows } = await client.query(`
        SELECT * FROM "students"
        WHERE "instructorId"=${id};
    `);
  return rows;
}

async function getAllInstructors() {
  try {
    const { rows } = await client.query(`
        SELECT *
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

module.exports = {
  createInstructor,
  getAllInstructors,
};
