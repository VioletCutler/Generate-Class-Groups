const { client } = require("../client");
const { unenrollStudent } = require("./classrooms");
// Create Student
async function createStudent({ name }) {
  try {
    const {
      rows: [newStudent],
    } = await client.query(
      `
            INSERT INTO "students"(name)
            VALUES ($1)
            RETURNING *
        `,
      [name]
    );
    return newStudent;
  } catch (error) {
    throw error;
  }
}

// Update Student
async function updateStudent(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    if (setString.length > 0) {
      const {
        rows: [student],
      } = await client.query(
        `
            UPDATE students
            SET ${setString}
            WHERE id=${id}
            RETURNING *;
        `,
        Object.values(fields)
      );

      return student;
    }
  } catch (error) {
    throw error;
  }
}

// Get All Students
async function getAllStudents() {
  try {
    const { rows } = await client.query(`
        SELECT *
        FROM STUDENTS
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

// Get Student by Id
async function getStudentById({ id }) {
  try {
    const {
      rows: [student],
    } = await client.query(
      `
    SELECT * FROM students
    WHERE id=$1;
  `,
      [id]
    );
    return student;
  } catch (error) {
    throw error;
  }
}

async function getStudentByName({ name }) {
  try {
    const {
      rows: [student],
    } = await client.query(
      `
      SELECT * FROM students
      WHERE name=$1;
    `,
      [name]
    );
    return student;
  } catch (error) {
    throw error;
  }
}

// Delete student
async function deleteStudent({ id }) {
  try {
    // first unenroll student
    await unenrollStudent({ studentId: id });
    console.log("successfully unenrolled");
    console.log("Delete Student Id :", id);
    // then delete student from database
    const {
      rows: [deletedStudent],
    } = await client.query(
      `
    DELETE FROM students
    WHERE id=$1
    RETURNING *;
  `,
      [id]
    );

    return deletedStudent;
  } catch (error) {}
}

module.exports = {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudentById,
  deleteStudent,
  getStudentByName,
};
