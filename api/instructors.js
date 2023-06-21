const Express = require("express");
const instructorsRouter = Express.Router();
const {
  getAllInstructors,
  getInstructorByUsername,
  createInstructor,
  loginInstructor,
  getInstructorById,
  deleteInstructor,
  getClassroomsByInstructorId,
  getInstructorByEmail,
  updateInstructor
} = require("../db");
const {
  requireAuthorization,
  requireAdmin,
  requireAdminOrAuthorizedUser,
} = require("./utils/utils");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const ApiError = require("./error/ApiError");
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

instructorsRouter.use((req, res, next) => {
  console.log("A request has been made to /instructors");
  next();
});

//GET all instructors
instructorsRouter.get("/", requireAdmin, async (req, res) => {
  try {
    const instructors = await getAllInstructors();
    res.send({ success: true, instructors });
    return;
  } catch (error) {
    throw error;
  }
});

//GET logged in instructors info
instructorsRouter.get("/me", requireAuthorization, async (req, res, next) => {
  try {
    const instructor = {}
    instructor.details = await getInstructorById({id: req.instructor.id});
    instructor.classrooms = await getClassroomsByInstructorId({
      instructorId: req.instructor.id,
    });
    if (instructor.details) {
      res.send({
        success: true,
        instructor,
      });
    } else {
      next(ApiError.badRequest('Something went wrong'))
    }
  } catch (error) {
    throw error;
  }
});

//GET instructor by id
instructorsRouter.get(
  "/:instructorId",
  requireAdmin,
  async (req, res, next) => {
    const { instructorId } = req.params;

    try {
      const instructor = await getInstructorById({ id: instructorId });
      if (instructor) {
        res.send({
          success: true,
          instructor,
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

//GET classrooms by instructorId
instructorsRouter.get(
  "/:instructorId/classrooms",
  requireAdmin,
  async (req, res, next) => {
    try {
      // const instructor = await getInstructorById({id: req.instructor.id});
      const instructor = await getClassroomsByInstructorId({
        instructorId: req.instructor.id,
      });
      if (instructor) {
        res.send({
          success: true,
          instructor,
        });
      }
    } catch (error) {
      throw error;
    }
  }
);

//DELETE instructor
instructorsRouter.delete(
  "/:instructorId",
  requireAuthorization,
  async (req, res, next) => {
    const { instructorId } = req.params;

      const deletedUser = await deleteInstructor({ instructorId });
      if (deletedUser) {
        res.send({ success: true, deletedUser, message: "User successfully deleted" });
      } else {
        next(ApiError.internal("Something went wrong."));
      }
    
    return;
    // I need to check to see if the user is either the same user or is an admin before deleting
  }
);

instructorsRouter.post("/register", async (req, res, next) => {
  try {
    const { name, username, password, email } = req.body;
    const _user = await getInstructorByUsername({ username: username });
    const _email = await getInstructorByEmail({email})

    if (_user) {
      next(ApiError.badRequest("A user by that username already exists."));
      return;
    }  else if (_email){
      next(
        ApiError.badRequest("This email is already associated with an account")
      )
    } else if (password.length < 8){
      next(ApiError.badRequest('Password is too short'))
    } else {
      const newUser = await createInstructor({
        name,
        username,
        password,
        email
      });
      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.name,
        },
        JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN
        }
      );
      res.send({
        success: true,
        message: "Thank you for signing up!",
        token,
      });
    }
  } catch (error) {
    throw error;
  }
});

instructorsRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await loginInstructor({ username, password });
    if (!user) {
      next(ApiError.badRequest("Username or password is incorrect."));
      return;
    } else {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN
        }
      );
      console.log('token', token)
      res.send({
        success: true,
        user,
        token,
        message: "You have been logged in successfully."
      });
    }
  } catch (error) {
    throw error;
  }
});

instructorsRouter.patch('/', requireAuthorization, async (req, res, next) => {
  try {
    const { name, username, password, email, isActive } = req.body;

    const fieldsObject = {};
    if (name) fieldsObject.name = name;
    if (username) fieldsObject.username = username;
    if (password) fieldsObject.password = await bcrypt.hash(password, SALT_COUNT)
    if (email) fieldsObject.email = email;
    if (isActive) fieldsObject.isActive = isActive;
    const updatedInstructor = await updateInstructor(req.instructor.id, fieldsObject)
    if (updatedInstructor){
      delete updatedInstructor.password
      delete updatedInstructor.isAdmin
      res.send({success:true, updatedInstructor, message: "Account successfully updated."})
    } else {
      next(
        ApiError.internal("Something went wrong.")
      )
    }

  } catch (error) {
    next(ApiError.internal("Something went wrong."))
  }
})

module.exports = instructorsRouter;
