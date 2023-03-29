const Express = require("express");
const instructorsRouter = Express.Router();
const {
  getAllInstructors,
  getInstructorByUsername,
  createInstructor,
  getInstructor
} = require("../db");
const requireAuthorization = require('./utils')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const ApiError = require('./error/ApiError')

instructorsRouter.use((req, res, next) => {
  console.log("A request has been made to /instructors");
  next();
});



instructorsRouter.get("/", requireAuthorization, async (req, res) => {
  try {
    const instructors = await getAllInstructors();
    console.log('Instructors:', instructors)
    res.send({ success: true, instructors });
    return;
  } catch (error) {
    throw error;
  }
});

instructorsRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getInstructorByUsername(username);
    if (_user) {
      next(ApiError.badRequest("A user by that username already exists"))
      return;
    } else {
      const newUser = await createInstructor({
        username,
        password,
      });
      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.name,
        },
        JWT_SECRET
      );
      res.send({
        success: true,
        message: "Thank you for signing up",
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
    const user = await getInstructor({ username, password });
    if (!user) {
      next(ApiError.badRequest('Username or password is incorrect'))
      return;
    } else {
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET)
      res.send({
        user,
        token
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = instructorsRouter;
