const {
  createInstructor,
  createStudent,
  getAllStudents,
  updateStudent,
  getAllInstructors,
  createNewClassroom,
  enrollStudent
} = require("./");
const {
  seedInstructors,
  seedStudents,
  seedClassrooms,
  createSeedClassEnrollments
} = require("./seedData.js");
const { client } = require("./client");

async function dropTables() {
  try {
    console.log("starting to drop tables...");
    await client.query(`
            DROP TABLE IF EXISTS "classEnrollment";
            DROP TABLE IF EXISTS "instructorsClasses";
            DROP TABLE IF EXISTS "classrooms";
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
                "isAdmin" BOOLEAN DEFAULT false,
                email VARCHAR(255) UNIQUE NOT NULL 
            );
            CREATE TABLE "students" (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
                );
                CREATE TABLE "classrooms" (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) UNIQUE NOT NULL,
                  "inSession" BOOLEAN default FALSE
                );
                CREATE TABLE "instructorsClasses" (
                  id SERIAL PRIMARY KEY,
                  "instructorId" INTEGER REFERENCES instructors(id),
                  "classroomId" INTEGER REFERENCES classrooms(id),
                  UNIQUE ("instructorId", "classroomId")
                );
                CREATE TABLE "classEnrollment" (
                  id SERIAL PRIMARY KEY,
                  "classroomId" INTEGER REFERENCES classrooms(id),
                  "studentId" INTEGER REFERENCES students(id),
                  UNIQUE ("studentId", "classroomId")
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

    console.log('creating instructors...')
    await Promise.all(
      seedInstructors.map((newUser) => createInstructor(newUser))
    );
    console.log('...finished creating instructors')
    console.log('creating students...')
    await Promise.all(
      seedStudents.map((newStudent) => createStudent(newStudent))
    );
    console.log('...finished creating students')
    console.log('creating classrooms...')
      await Promise.all(
        seedClassrooms.map((newClassroom) => createNewClassroom(newClassroom))
      )
      console.log('...finished creating classrooms')
      console.log("enrolling students...")
      const seedEnrollments = createSeedClassEnrollments(seedStudents, seedInstructors)
      await Promise.all(seedEnrollments.map((seedEnrollment) => enrollStudent(seedEnrollment)))
      console.log('...finished enrolling students')
   
    console.log("...finished building database");
  } catch (error) {
    console.log(error);
  }
}

async function testDB() {
  try {
    // console.log("beginning to test db");
    // const allStudents = await getAllStudents()
    // console.log('All Students:', allStudents)
    // const updatedStudent = await updateStudent(allStudents[0].id, {name: 'Handsome Bob'})
    // console.log(updatedStudent)
    // const allInstructors = await getAllInstructors()
    // console.log('All Instructors:', allInstructors)
  } catch (error) {
    throw error;
  }
}

buildDatabase()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
