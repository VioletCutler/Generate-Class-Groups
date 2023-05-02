const { client } = require("../client");

// Create Student
async function createStudent({ name}) {
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
    if (setString.length > 0){

    
    const { rows: [student] } = await client.query(
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
async function getStudentById(id){
  const { rows: [student]} = await client.query(`
    SELECT * FROM students
    WHERE id=${id};
  `)
  return student
}

// Get Student by Name

// Delete student

module.exports = {
  createStudent,
  updateStudent,
  getAllStudents,
  getStudentById 
};
