const Express = require("express");
const classroomsRouter = Express.Router();
const { requireAuthorization } = require("./utils/utils");
const {
  createNewClassroom,
  addInstructorToClass,
  getClassroomByName,
  updateClassroom,
  getClassroomById,
  deleteClassroom
} = require("../db");
const ApiError = require("./error/ApiError");

classroomsRouter.use((req, res, next) => {
  console.log("A request has been made to the classrooms router");
  next();
});

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
      res.send({ success: true, classroom: newClassroom });
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

      //confirm that classroom exists
      const _classroom = await getClassroomByName({ classroomName: name });
      if (_classroom) {
        next(ApiError.badRequest("A classroom by that name already exists."));
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
      }

      //build fields object for updateClassroom function
      const fieldsObject = {};
      fieldsObject.name = name;

      if (inSession) {
        fieldsObject.inSession = inSession;
      }

      //update classroom
      const updatedClassroom = await updateClassroom(classroomId, fieldsObject);
      res.send({
        success: true,
        updatedClassroom,
      });
    } catch (error) {
      throw error;
    }
  }
);

classroomsRouter.delete('/:classroomId', requireAuthorization, async (req, res, next) => {
    try {
        const { classroomId } = req.params;

        const { instructors } = await getClassroomById({id: classroomId});
        const correctInstructor = instructors.filter((instructor)=> instructor.id == req.instructor.id)
        if (!correctInstructor.length){
            next(ApiError.unauthorizedRequest("You are not authorized to make this request."))
        }
        const deletedClassroom = await deleteClassroom({id: classroomId});
        if (deletedClassroom){
            res.send({
                success: true,
                deletedClassroom
            })
        } else {
            next(ApiError.internal("Something went wrong."))
        }
    } catch (error) {
        throw error
    }
})

module.exports = classroomsRouter;
