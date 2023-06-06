const Express = require("express");
const router = Express.Router();
const { client } = require("../db/client");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getInstructorById } = require("../db");

// router.use('*', (req, res, next)=> {
//     console.log('a request is being made to the API router')
//     next()
// })

router.use("/health", async (req, res, next) => {
  try {
    const uptime = process.uptime();
    // const {rows: [dbConnection]} = await client.query(`SELECT NOW();`)
    const currentTime = new Date();
    const lastRestart = new Intl.DateTimeFormat("en", {
      timestyle: "long",
      dateStyle: "long",
      timeZone: "America/New_York",
    }).format(currentTime - uptime * 1000);
    res.send({ message: "healthy", uptime, currentTime, lastRestart });
  } catch (error) {
    next(error);
  }
});

router.use(async (req, res, next) => {
  const auth = req.header("Authorization");
  try {
    const prefix = "Bearer ";
    if (auth) {
      const token = auth.slice(prefix.length);
      console.log('token:', token)
      const { id } = jwt.verify(token, JWT_SECRET);
      console.log('jwt verify', id)
      if (!id) {
        next();
      } else {
        const instructor = await getInstructorById({id});
        console.log('instructor:', instructor)
        req.instructor = instructor;
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    throw error;
  }
});

router.use((req, res, next) => {
  console.log('req.instructor:', req.instructor)
  next()
})

const instructorsRouter = require("./instructors");
router.use("/instructors", instructorsRouter);
const studentsRouter = require("./students");
router.use("/students", studentsRouter);
const classroomsRouter = require("./classrooms");
router.use("/classrooms", classroomsRouter);
const enrollmentRouter = require("./enrollment");
router.use("/enrollment", enrollmentRouter)

module.exports = router;
