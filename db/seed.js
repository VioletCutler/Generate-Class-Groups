const {
  createInstructor,
  createStudent,
  getAllStudents,
  updateStudent,
  getAllInstructors,
  createNewClassroom,
  enrollStudent,
  deactivateAccount,
  updateInstructor,
  getInstructorById,
  getStudentById,
  addInstructorToClass
} = require("./");
const {
  createSeedInstructorAssignments,
  seedInstructors,
  seedStudents,
  seedClassrooms,
  createSeedClassEnrollments,
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
                email VARCHAR(255) UNIQUE NOT NULL,
                "isActive" BOOLEAN DEFAULT true 
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

    console.log("creating instructors...");
    await Promise.all(
      seedInstructors.map((newUser) => createInstructor(newUser))
    );
    console.log("...finished creating instructors");

    console.log("creating students...");
    await Promise.all(
      seedStudents.map((newStudent) => createStudent(newStudent))
    );
    console.log("...finished creating students");

    console.log("creating classrooms...");
    await Promise.all(
      seedClassrooms.map((newClassroom) => createNewClassroom(newClassroom))
    );
    console.log("...finished creating classrooms");

    console.log("assigning instructors...");
    const seedAssignments = createSeedInstructorAssignments(seedInstructors);
    await Promise.all(
      seedAssignments.map((seedAssignment) => addInstructorToClass(seedAssignment))
    );
    console.log("...finished enrolling students");

    console.log("enrolling students...");
    const seedEnrollments = createSeedClassEnrollments(seedStudents);
    await Promise.all(
      seedEnrollments.map((seedEnrollment) => enrollStudent(seedEnrollment))
    );
    console.log("...finished enrolling students");

    // - Associate instructors with classes

    console.log("...finished building database");
  } catch (error) {
    console.log(error);
  }
}

async function testDB() {
  try {
    console.log("beginning to test database...");

    /*
    Cases to test:
 
 


  

    - Get all classrooms with their instructors and students all attached
      - [An array of classroom objects with instructors and students attached as 
        additional arrays]

    - Get classrooms by Instructor


    - Change enrollment for a list of students from one class to another

    - Deactive an instructors account

    - Delete an instructors account

    - Delete a student from the database
      - remove their association with a classroom
      - delete them from the students table
    */

    // Get all instructors
    const instructors = await getAllInstructors();
    console.log("All Instructors :", instructors);

    const students = await getAllStudents();
    console.log("All students :", students);

    const singleUserId1 = await getInstructorById({ id: 1 });
    console.log("testUserOne :", singleUserId1);

    const selectedInstructorArray = [];
    selectedInstructorArray.push(await getInstructorById({ id: 1 }));
    selectedInstructorArray.push(await getInstructorById({ id: 3 }));
    selectedInstructorArray.push(await getInstructorById({ id: 5 }));
    selectedInstructorArray.push(await getInstructorById({ id: 7 }));
    console.log("Selected instructors :", selectedInstructorArray);

    const selectedStudentArray = [];
    selectedStudentArray.push(await getStudentById(34));
    selectedStudentArray.push(await getStudentById(3));
    selectedStudentArray.push(await getStudentById(167));
    selectedStudentArray.push(await getStudentById(45));
    selectedStudentArray.push(await getStudentById(111));
    selectedStudentArray.push(await getStudentById(1));
    selectedStudentArray.push(await getStudentById(200));
    selectedStudentArray.push(await getStudentById(85));
    console.log("Selected students :", selectedStudentArray);

    // await deactivateAccount({id: 1})

    // const allStudents = await getAllStudents()
    // console.log('All Students:', allStudents)
    // const updatedStudent = await updateStudent(allStudents[0].id, {name: 'Handsome Bob'})
    // console.log(updatedStudent)
    // const allInstructors = await getAllInstructors()
    // console.log('All Instructors:', allInstructors)
    console.log("...finished testing database");
  } catch (error) {
    throw error;
  }
}

buildDatabase()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
