const Express = require("express");
const studentsRouter = Express.Router();
const {
  getAllStudents,
  getStudentsByInstructor,
  updateStudent,
  getStudentById,
  createStudent,
  enrollStudent,
  getClassroomById,
  deleteStudent,
  getInstructorsByClassroomId
} = require("../db");
const { requireAuthorization, requireAdmin } = require("./utils/utils.js");
const ApiError = require("./error/ApiError");

studentsRouter.use((req, res, next) => {
  console.log("A request has been made to the students router");
  next();
});

studentsRouter.get("/", requireAdmin, async (req, res) => {
  try {
    const students = await getAllStudents();
    res.send({ success: true, students });
  } catch (e) {
    next(ApiError.internal("Something went wrong."));
  }
});

studentsRouter.get('/:studentId', requireAuthorization, async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const student = await getStudentById({id: studentId})
    console.log('student:', student)
    if (student){
      const instructors = await getInstructorsByClassroomId({id: student.classroomId})
      const correctInstructor = instructors.filter((instructor) => instructor.id == req.instructor.id)
      if (correctInstructor.length){
        res.send({success: true, student})
      } else {
        next(ApiError.unauthorizedRequest('Unauthorized user.'))
        return
      }
    } else {
      next(ApiError.badRequest('No student found.'))
      return
    }
   
 
  } catch (error) {
    throw error
  }
})

studentsRouter.post(
  "/enrollment",
  requireAuthorization,
  async (req, res, next) => {
    const { student, classroomId } = req.body;

    try {
      //confirm that a classrooms exists for student to be enrolled into
      const classroom = await getClassroomById({ id: classroomId });
      const correctInstructor = classroom.instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );
      if (classroom.classroomInfo === undefined) {
        next(
          ApiError.badRequest(
            "This classroom id does not match an existing classroom."
          )
        );
      } else if (!correctInstructor.length) {
        next(
          ApiError.unauthorizedRequest(
            "You can only enroll students in your classrooms"
          )
        );
      } else {
        //create new student
        const createdStudent = await createStudent({ name: student });

        //enroll new student in class
        await enrollStudent({
          studentId: createdStudent.id,
          classroomId,
        });

        res.send({ success: true, student: createdStudent });
      }
    } catch (e) {
      next(ApiError.internal("There was an error creating this student."));
    }
  }
);

studentsRouter.patch(
  "/:studentId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const { name } = req.body;

      console.log('received studentId:', studentId)

      const studentToUpdate = await getStudentById({ id: studentId });
      if (!studentToUpdate) {
        next(ApiError.badRequest("No student to update."));
      }

      console.log('name:', name, 'studentTOUpdate:', studentToUpdate)

      const updateObject = {};
      if (name === studentToUpdate.name){
  
        res.send({success: true, studentToUpdate,
        message: "Student successfully updated"})
        return 
      }
      if (name) updateObject.name = name;
      console.log("Update Object", updateObject);
      const updatedStudent = await updateStudent(studentId, updateObject);
      console.log("updated student", updatedStudent);
      if (updatedStudent) {
        res.send({
          success: true,
          updatedStudent,
          message: "Student successfully updated",
        });
      } else {
        next(ApiError.internal("There was an error updating this student."));
      }
    } catch (e) {
      next(ApiError.internal("There was an error updating this student."));
    }
  }
);

studentsRouter.delete(
  "/:studentId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { studentId } = req.params;

      //confirm that the student to delete is in fact this instructors student
      const usersStudents = await getStudentsByInstructor({
        id: req.instructor.id,
      });
      console.log("Users Students:", usersStudents);
      console.log(studentId);
      const correctStudent = usersStudents.filter(
        (student) => student.id == studentId
      );

      if (!correctStudent.length) {
        next(
          ApiError.unauthorizedRequest(
            "You are not authorized to make this request."
          )
        );
      }

      const deletedStudent = await deleteStudent({ id: studentId });
      if (deletedStudent) {
        res.send({
          success: true,
          deletedStudent,
        });
      } else {
        next(ApiError.internal("Something went wrong."));
      }
    } catch (e) {
      next(ApiError.internal("There was an error deleting this student."));
    }
  }
);

module.exports = studentsRouter;
