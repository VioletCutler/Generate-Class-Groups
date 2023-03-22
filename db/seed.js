const { createInstructor, createStudent, getAllStudents } = require("./");
const { newInstructors, newStudents } = require("../src/dummyData/dummyData");
const { client } = require("./client");

async function dropTables() {
  try {
    console.log("starting to drop tables...");
    await client.query(`
            DROP TABLE IF EXISTS "students";
            DROP TABLE IF EXISTS "instructors";
        `);
    console.log("...finished dropping tables");
  } catch (error) {
    console.log(error);
  }
}

async function createTables() {
  try {
    console.log("starting to create tables...");
    await client.query(`
            CREATE TABLE "instructors" (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL, 
                isAdmin BOOLEAN DEFAULT false 
            );
            CREATE TABLE "students" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                classroom VARCHAR(255) NOT NULL,
                "instructorId" INTEGER REFERENCES instructors(id)
                );
        `);
    console.log("...finished creating tables");
  } catch (error) {
    console.log(error);
  }
}

async function buildDatabase() {
  try {
    client.connect();

    console.log("beginning to build database...");
    await dropTables();
    await createTables();
    await Promise.all(
      newInstructors.map((newUser) => createInstructor(newUser))
    );
    await Promise.all(
      newStudents.map((newStudent) => createStudent(newStudent))
    );

    console.log("...finished building database");
  } catch (error) {
    console.log(error);
  }
}

async function testDB() {
  try {
    console.log("beginning to test db");
    const allStudents = await getAllStudents()
    console.log('getting all students:', allStudents)

    
  } catch (error) {
    throw error;
  }
}

buildDatabase()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
