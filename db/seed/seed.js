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
  addInstructorToClass,
  getClassroomsByInstructorId,
  deleteStudent,
  getClassroomById,
  getInstructorsByClassroomId,
  getStudentsByClassroomId
} = require("..");
const {
  createSeedInstructorAssignments,
  seedInstructors,
  seedStudents,
  seedClassrooms,
  createSeedClassEnrollments,
} = require("./seedData.js");
const { client } = require("../client");

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
                name VARCHAR(255) NOT NULL,
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

    /* ======================================================= //
    Cases left to test:
 
    - Get all classrooms with their instructors and students all attached
      - [An array of classroom objects with instructors and students attached as 
        additional arrays]

    - Get classrooms by Instructor

    - Change enrollment for a list of students from one class to another

    - Deactive an instructors account

    - Delete an instructors account

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

 

    // Test Case #1 ================================== //

    //create new user
    const jenny = await createInstructor({name: 'Jenny', username:'jenny99', email:'jenny99@gmail.com', password:'12345678'})
    console.log('new instructor :', jenny)

    //create new classroom
    const jennysClassroom = await createNewClassroom({name: 'Jenny\'s Classroom', inSession: false})

    //assign Jenny to the new classroom
    const jennysClassroomAssigment = await addInstructorToClass({classroomId: jennysClassroom.id, instructorId: jenny.id})
    
    // create new students
    const newStudentArray = [
      'Bobby C.',
      'Jared R',
      'Ramona I.',
      'Perry S',
      'Mecca W.',
      'Reggie W.',
      'Tariq R',
      'Jess G.',
      'Katy C.'
    ]

    const newStudents = await Promise.all(newStudentArray.map((student) => createStudent({name: student})))
    console.log('New Students :', newStudents)
    const newlyEnrolledStudents = await Promise.all(newStudents.map((student) => enrollStudent({classroomId: jennysClassroom.id, studentId: student.id})))

    console.log('Jenny\'s Initialized Classroom :', jennysClassroom)
    console.log('Jenny\'s Classroom Enrollment :', newlyEnrolledStudents)

    console.log('Delete Student Bobby C. {id 201}...')
    const deletedBobbyC = await deleteStudent({id: newStudents[0].id})
    console.log('Deleted Bobby C:', deletedBobbyC)


    console.log('Getting Jenny\'s full class...')
    const jennysClassWithStudents = await getClassroomById({id: jennysClassroom.id})
    console.log('Jenny\'s Classroom with Instructor and Students :', jennysClassWithStudents)


    console.log('Adding instructor to Jenny\'s classroom ..')
    await addInstructorToClass({classroomId: jennysClassroom.id, instructorId: instructors[0].id})

    console.log('Getting Instructors by Classroom Id :', await getInstructorsByClassroomId({id: jennysClassroom.id}))

    console.log('Getting Students by Classroom Id :', await getStudentsByClassroomId({id: jennysClassroom.id}))

    console.log("...finished testing database");
  } catch (error) {
    throw error;
  }
}

buildDatabase()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
