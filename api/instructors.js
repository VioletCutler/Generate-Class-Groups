const Express = require("express");
const instructorsRouter = Express.Router();
const { getAllInstructors, getInstructorByUsername, createInstructor } = require("../db");
const JWT = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = process.env;

instructorsRouter.use((req, res, next) => {
  console.log("A request has been made to /instructors");
  next();
});

instructorsRouter.get("/", async (req, res) => {
  try {
    const instructors = await getAllInstructors();
    res.send({ success: true, instructors });
  } catch (error) {
    res.send(error);
  }
});

instructorsRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const _user = await getInstructorByUsername(username);
    if (_user) {
      res.send({
        success: false,
        message: "A user by that username already exists",
      });
    } else {
      const newUser = await createInstructor({
        username,
        password,
      });
      const token = JWT.sign(
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

module.exports = instructorsRouter;
