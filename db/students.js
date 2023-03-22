const { client } = require("./client");

async function createStudent({ name, classroom, instructorId }) {
  try {
    const {
      rows: [newStudent],
    } = await client.query(
      `
            INSERT INTO "students"(name, classroom, "instructorId")
            VALUES ($1, $2, $3)
            RETURNING *
        `,
      [name, classroom, instructorId]
    );
    return newStudent;
  } catch (error) {
    throw error;
  }
}

async function updateStudent(id, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [instructor],
    } = await client.query(
      `
            UPDATE students
            SET ${setString}
            WHERE id=${id}
            RETURNING *
        `,
      Object.values(fields)
    );

    return instructor;
  } catch (error) {
    throw error;
  }
}

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

module.exports = {
  createStudent,
  updateStudent,
  getAllStudents
};
