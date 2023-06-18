const Express = require("express");
const classroomsRouter = Express.Router();
const { requireAuthorization, requireAdmin } = require("./utils/utils");
const {
  createNewClassroom,
  addInstructorToClass,
  getClassroomByName,
  updateClassroom,
  getClassroomById,
  deleteClassroom,
  getAllClassrooms,
  getClassroomsByInstructorId,
} = require("../db");
const ApiError = require("./error/ApiError");

classroomsRouter.use((req, res, next) => {
  console.log("A request has been made to the classrooms router");
  next();
});

//GET all classrooms
classroomsRouter.get("/", requireAdmin, async (req, res, next) => {
  try {
    const _classrooms = await getAllClassrooms();

    const classrooms = await Promise.all(
      _classrooms.map((classroom) => getClassroomById({ id: classroom.id }))
    );

    res.send({
      success: true,
      classrooms,
    });
  } catch (e) {
    next(ApiError.internal("Something went wrong."));
  }
});

//GET classrooms by id
classroomsRouter.get(
  "/:classroomId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId } = req.params;

      const classroom = await getClassroomById({
        id: classroomId,
      });

      res.send({ success: true, classroom });
    } catch (e) {
      next(ApiError.internal("Something went wrong."));
    }
  }
);

//POST classroom
classroomsRouter.post("/", requireAuthorization, async (req, res, next) => {
  const { classroomName, inSession } = await req.body;
  /*
    When creating a new classroom:
    - Create Classroom
    - Add Instructor to Classroom
    */
  //see if there is already a classroom by that name
  try {
    const _classroom = await getClassroomByName({ classroomName });

    if (_classroom) {
      next(ApiError.badRequest("A classroom by that name already exists."));
    } else {
      //create new classroom
      const newClassroom = await createNewClassroom({
        name: classroomName,
        inSession,
      });

      //add instructor to newly created classroom
      await addInstructorToClass({
        classroomId: newClassroom.id,
        instructorId: req.instructor.id,
      });

      console.log("classrooms router POST /");
      res.send({
        success: true,
        classroom: {
          classroomInfo: newClassroom,
          instructors: [req.instructor],
        },
        students: [],
      });
    }
  } catch (error) {
    throw error;
  }
});

//PATCH classroom
classroomsRouter.patch(
  "/:classroomId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId } = req.params;
      const { name, inSession } = req.body;
      console.log("PATCH /classrooms (name)", name);
      //confirm that classroom exists
      const _classroom = await getClassroomByName({ classroomName: name });

      if (_classroom && _classroom.id != classroomId) {
        next(
          ApiError.badRequest(
            "A classroom by that name already exists. Try a different name."
          )
        );
        return;
      }

      //confirm that current user is correct instructor
      const { instructors } = await getClassroomById({ id: classroomId });
      const correctInstructor = instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );
      if (!correctInstructor.length) {
        next(
          ApiError.unauthorizedRequest(
            "You are not authorized to make this request."
          )
        );
        return;
      }

      //update classroom
      const updatedClassroom = await updateClassroom(classroomId, {
        name,
        inSession,
      });
      res.send({
        success: true,
        updatedClassroom,
      });
    } catch (error) {
      throw error;
    }
  }
);

//DELETE classroom
classroomsRouter.delete(
  "/:classroomId",
  requireAuthorization,
  async (req, res, next) => {
    try {
      const { classroomId } = req.params;

      const { instructors } = await getClassroomById({ id: classroomId });
      const correctInstructor = instructors.filter(
        (instructor) => instructor.id == req.instructor.id
      );
      if (!correctInstructor.length && !req.instructor.isAdmin) {
        next(
          ApiError.unauthorizedRequest(
            "You are not authorized to make this request."
          )
        );
        return;
      }
      const deletedClassroom = await deleteClassroom({ id: classroomId });
      if (deletedClassroom) {
        res.send({
          success: true,
          deletedClassroom,
        });
      } else {
        next(ApiError.internal("Something went wrong."));
      }
    } catch (error) {
      throw error;
    }
  }
);

module.exports = classroomsRouter;
