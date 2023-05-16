const Express = require("express");
const enrollmentRouter = Express.Router();
const { requireAuthorization, requireAdmin } = require("./utils/utils");
const { getClassroomById, enrollStudent, unenrollStudent } = require("../db");
const ApiError = require("./error/ApiError");

enrollmentRouter.use((req, res, next) => {
  console.log("A request has been made /api/enrollment");
  next();
});

//enroll student
enrollmentRouter.post(
  "/:classroomId/students",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId } = req.params;
      const { students } = req.body;

      //check that there is an existing classroom with this Id
      const classroom = await getClassroomById({ id: classroomId });

      //if no classroom exists, send error message
      if (classroom.classroomInfo === undefined) {
        next(ApiError.badRequest("This classroom does not exist"));
        return;
      }

      //check the list of instructors and confirm that the person making this request is indeed associated with this classroom
      const correctInstructor = classroom.instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );

      if (!correctInstructor.length) {
        next(ApiError.unauthorizedRequest("Wrong classroom"));
        return;
      }

      //check to see if students are already created. if not, create them.
      const newlyCreatedStudents = await Promise.all(
        students.map((student) => createStudent({ name: student }))
      );

      const enrolledStudents = await Promise.all(
        newlyCreatedStudents.map((student) =>
          enrollStudent({ studentId: student.id, classroomId: classroomId })
        )
      );

      if (enrolledStudents.length) {
        res.send({
          success: true,
          enrolledStudents,
        });
      } else {
        next(ApiError.internal());
        return;
      }
    } catch (error) {
      throw error;
    }
  }
);

//Unenroll student
enrollmentRouter.delete(
  "/:classroomId/students/:studentId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId, studentId } = req.params;

      const classroom = await getClassroomById({ id: classroomId });

      const correctInstructor = classroom.instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );

      if (!correctInstructor.length) {
        next(ApiError.unauthorizedRequest("Wrong classroom"));
        return;
      } else {
        const unenrolledStudent = await unenrollStudent({ studentId });
        if (unenrolledStudent) {
          res.send({
            success: true,
            unenrolledStudent,
          });
        } else {
          next(ApiError.internal());
        }
      }
    } catch (error) {
      throw error;
    }
  }
);

//Re-enroll student in new classroom
enrollmentRouter.patch(
  "/:classroomId/students/:studentId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId, studentId } = req.params;
      const { newClassroomId } = req.body;

      //confirm this user is the correct instructor
      const classroom = await getClassroomById({ id: classroomId });

      const correctInstructor = classroom.instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );

      if (!correctInstructor.length) {
        next(ApiError.unauthorizedRequest("Wrong classroom"));
        return;
      } else {
        const unenrolledStudent = await unenrollStudent({ studentId });
        const updatedEnrollment = await enrollStudent({
          studentId,
          classroomId: newClassroomId,
        });
        if (updatedEnrollment) {
          res.send({ success: true, updatedEnrollment });
        } else {
          next(ApiError.internal());
        }
      }
    } catch (error) {
      throw error;
    }
  }
);

module.exports = enrollmentRouter;
