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

studentsRouter.post("/", requireAuthorization, async (req, res, next) => {
  const { student, classroomId } = req.body;

  try {
    //confirm that a classrooms exists for student to be enrolled into
  const classroom = await getClassroomById({ id: classroomId });
  if (classroom.classroomInfo === undefined) {
    next(
      ApiError.badRequest(
        "You must create a classroom before you can create a student."
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
  
});

studentsRouter.patch(
  "/:studentId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const { name } = req.body;

      const studentToUpdate = await getStudentById({ id: studentId });
      if (!studentToUpdate) {
        next(ApiError.badRequest("No student to update."));
      }

      const updateObject = {};
      if (name) updateObject.name = name;

      const updatedStudent = await updateStudent(id, updateObject);
      if (updatedStudent){
        res.send({ success: true, updatedStudent, message: "Student successfully updated"});
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
      const correctStudent = await usersStudents.filter(
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
    next(ApiError.internal("There was an error deleting this student."));    }
  }
);

module.exports = studentsRouter;
