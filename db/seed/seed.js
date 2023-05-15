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
  getStudentsByClassroomId,
  getAllClassrooms,
  getAllClassroomsWithInstructorsAndStudents,
  getAllInSessionClassrooms,
  updateClassroom,
  getStudentByName,
  deleteInstructor,
} = require("../");
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

    //Build Database
    console.log(
      "//=================== Beginning to Build Database ===============//"
    );
    await dropTables();
    await createTables();

    //Create Instructors
    console.log("creating instructors...");
    await Promise.all(
      seedInstructors.map((newUser) => createInstructor(newUser))
    );
    console.log("...finished creating instructors");

    //Create Students
    console.log("creating students...");
    await Promise.all(
      seedStudents.map((newStudent) => createStudent(newStudent))
    );
    console.log("...finished creating students");

    //Create Classrooms
    console.log("creating classrooms...");
    await Promise.all(
      seedClassrooms.map((newClassroom) => createNewClassroom(newClassroom))
    );
    console.log("...finished creating classrooms");

    //Assign Instructors
    console.log("assigning instructors...");
    const seedAssignments = createSeedInstructorAssignments(seedInstructors);
    await Promise.all(
      seedAssignments.map((seedAssignment) =>
        addInstructorToClass(seedAssignment)
      )
    );
    console.log("...finished enrolling students");

    //Enroll Students
    console.log("enrolling students...");
    const seedEnrollments = createSeedClassEnrollments(seedStudents);
    await Promise.all(
      seedEnrollments.map((seedEnrollment) => enrollStudent(seedEnrollment))
    );
    console.log("...finished enrolling students");

    console.log("//===============Finished Building Database===============//");
  } catch (error) {
    console.log(error);
  }
}

async function testDB() {
  try {
    console.log("//============= Begin testDB ==================// ");

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
    selectedStudentArray.push(await getStudentById({ id: 34 }));
    selectedStudentArray.push(await getStudentById({ id: 3 }));
    selectedStudentArray.push(await getStudentById({ id: 167 }));
    selectedStudentArray.push(await getStudentById({ di: 45 }));
    selectedStudentArray.push(await getStudentById({ id: 111 }));
    selectedStudentArray.push(await getStudentById({ id: 1 }));
    selectedStudentArray.push(await getStudentById({ id: 200 }));
    selectedStudentArray.push(await getStudentById({ id: 85 }));
    console.log("Selected students :", selectedStudentArray);

    console.log("Getting all classrooms...");
    const allClassrooms = await getAllClassrooms();
    console.log("All Classrooms :", allClassrooms);

    console.log(
      "Getting all classrooms with students and instructors attached..."
    );
    const allClassroomsWithInstructorsAndStudents =
      await getAllClassroomsWithInstructorsAndStudents();
    console.log(
      "All classrooms with instructors and students :",
      allClassroomsWithInstructorsAndStudents
    );
    console.log("First Classroom", allClassroomsWithInstructorsAndStudents[0]);
    console.log(
      "Last Classroom",
      allClassroomsWithInstructorsAndStudents[
        allClassroomsWithInstructorsAndStudents.length - 1
      ]
    );

    console.log("All In Session Classrooms", await getAllInSessionClassrooms());
    console.log("//================ End testDb ======================//");
  } catch (error) {
    throw error;
  }
}

async function testCase1() {
  try {
    console.log(
      "//======================== Begin testCase1 ================//"
    );
    /*
    Test Case 1 Contents:
      - create new user
      - create new classroom
      - assign Jenny to the new classroom
      - create new students
    */

    //create new user
    const jenny = await createInstructor({
      name: "Jenny",
      username: "jenny99",
      email: "jenny99@gmail.com",
      password: "12345678",
    });
    console.log("new instructor :", jenny);

    //create new classroom
    const jennysClassroom = await createNewClassroom({
      name: "Jenny's Classroom",
      inSession: false,
    });

    //assign Jenny to the new classroom
    const jennysClassroomAssigment = await addInstructorToClass({
      classroomId: jennysClassroom.id,
      instructorId: jenny.id,
    });

    // create new students
    const newStudentArray = [
      "Bobby C.",
      "Jared R",
      "Ramona I.",
      "Perry S",
      "Mecca W.",
      "Reggie W.",
      "Tariq R",
      "Jess G.",
      "Katy C.",
    ];

    const newStudents = await Promise.all(
      newStudentArray.map((student) => createStudent({ name: student }))
    );
    console.log("New Students :", newStudents);
    const newlyEnrolledStudents = await Promise.all(
      newStudents.map((student) =>
        enrollStudent({
          classroomId: jennysClassroom.id,
          studentId: student.id,
        })
      )
    );

    console.log("Jenny's Initialized Classroom :", jennysClassroom);
    console.log("Jenny's Classroom Enrollment :", newlyEnrolledStudents);
    console.log(
      "Jenny's Classroom w/ Students enrolled:",
      await getClassroomById({ id: jennysClassroom.id })
    );

    console.log("Delete Student Bobby C. {id 201}...");
    const deletedBobbyC = await deleteStudent({ id: newStudents[0].id });
    console.log("Deleted Bobby C:", deletedBobbyC);

    console.log("Delete Another Student, accessed by their name...");
    const jaredRToDelete = await getStudentByName({
      name: newStudents[1].name,
    });
    console.log("Student to delete :", jaredRToDelete);
    const deletedJaredR = await deleteStudent({ id: jaredRToDelete.id });
    console.log("Deleted Jared R:", deletedJaredR);
    console.log("Getting Jenny's full class...");

    const jennysClassroomWithInstructorAndStudents = await getClassroomById({
      id: jennysClassroom.id,
    });
    console.log(
      "Jenny's Classroom with Instructor and Students :",
      jennysClassroomWithInstructorAndStudents
    );

    console.log("Adding instructor to Jenny's classroom ..");
    const instructors = await getAllInstructors();
    await addInstructorToClass({
      classroomId: jennysClassroom.id,
      instructorId: instructors[0].id,
    });

    console.log(
      "Getting Instructors in Jenny's Classroom :",
      await getInstructorsByClassroomId({ id: jennysClassroom.id })
    );

    console.log(
      "Getting Students by Jenny's Classroom Id :",
      await getStudentsByClassroomId({ id: jennysClassroom.id })
    );

    console.log("Updating Jenny's Classroom...");
    const jennysUpdatedClassroom = await updateClassroom(jennysClassroom.id, {
      name: "Jenny's Updated Classroom",
      inSession: true,
    });
    console.log("Jenny's Updated Classroom :", jennysUpdatedClassroom);

    // Deactivate Jenny\'s Account
    console.log("Deactivate Jenny's Account...");
    console.log("Active Jenny :", jenny);
    const jennyDeactivated = await deactivateAccount({ id: jenny.id });
    console.log("Jenny Deactivated :", jennyDeactivated);

    console.log("//=============== End Test Case 1 ==============//");
  } catch (error) {
    throw error;
  }
}

async function testCase2() {
  try {
    console.log("//============== Begin Test Case 2 =================//");
    /* ======================================================= //
    Test Case 2 Goals:
    - Create New Instructor
    - Assign to Multiple Pre-existing Classes
    - Get classrooms by Instructor
    - Change enrollment for a list of students from one class to another
    - Deactive an instructors account
    - Delete an instructors account
    */

    //Create new instructor
    const johnny = await createInstructor({
      name: "Johnny",
      username: "Johnny99",
      password: "12345678",
      email: "Johnny99@gmail.com",
    });
    console.log("New Instructor :", johnny);

    //Create Johnny's Students
    const newStudentArray = [
      "Jeffrey C.",
      "Tony R",
      "Tabitha I.",
      "Pat S",
      "Mica W.",
      "Ronnie W.",
      "Tyler R",
      "Johnathan G.",
      "Kathryn C.",
    ];

    //Create Johnny's Classroom
    const johnnysClassroom = await createNewClassroom({
      name: "Johnny's Classroom",
      inSession: false,
    });
    const johnnysDuplicateClassroom = await createNewClassroom({
      name: "Johnny's Classroom",
      inSession: false,
    });
    console.log('Johnny\'s duplicate classroom:',johnnysDuplicateClassroom)

    //Assign Johnny to the new classroom
    const johnnysClassroomAssigment = await addInstructorToClass({
      classroomId: johnnysClassroom.id,
      instructorId: johnny.id,
    });

    //Enroll Johnny's Students in New Classroom
    const newStudents = await Promise.all(
      newStudentArray.map((student) => createStudent({ name: student }))
    );
    console.log("New Students :", newStudents);
    const newlyEnrolledStudents = await Promise.all(
      newStudents.map((student) =>
        enrollStudent({
          classroomId: johnnysClassroom.id,
          studentId: student.id,
        })
      )
    );

    //Assign Johnny to Multiple Pre-existing Classes
    console.log("Adding Johnny to Multiple Classrooms...");
    const allClassrooms = await getAllClassrooms();
    await addInstructorToClass({
      classroomId: allClassrooms[0].id,
      instructorId: johnny.id,
    });
    await addInstructorToClass({
      classroomId: allClassrooms[5].id,
      instructorId: johnny.id,
    });
    await addInstructorToClass({
      classroomId: allClassrooms[allClassrooms.length - 1].id,
      instructorId: johnny.id,
    });
    const johnnysClassrooms = await getClassroomsByInstructorId({
      instructorId: johnny.id,
    });
    console.log("Johnny's Classrooms :", johnnysClassrooms);

    // Delete Johnny\'s Account
    console.log("Deleting Johnny's Account...");
    const deletedJohnny = await deleteInstructor({ instructorId: johnny.id });
    console.log("Deleted Johnny:", deletedJohnny);

    console.log("//=============== End Test Case 2 ====================//");
  } catch (error) {
    throw error;
  }
}

buildDatabase()
  .then(testDB)
  .then(testCase1)
  .then(testCase2)
  .catch(console.error)
  .finally(() => client.end());
