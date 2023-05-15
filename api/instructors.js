const Express = require("express");
const instructorsRouter = Express.Router();
const {
  getAllInstructors,
  getInstructorByUsername,
  createInstructor,
  loginInstructor,
  getInstructorByEmail,
  getInstructorById,
  deleteInstructor,
  getClassroomsByInstructorId
} = require("../db");
const {requireAuthorization, requireAdmin,   requireAdminOrAuthorizedUser} = require('./utils/utils')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const ApiError = require('./error/ApiError')

instructorsRouter.use((req, res, next) => {
  console.log("A request has been made to /instructors");
  console.log('req.instructor:', req.instructor)
  next();
});

instructorsRouter.get("/", requireAdmin, async (req, res) => {
  try {
    const instructors = await getAllInstructors();
    res.send({ success: true, instructors });
    return;
  } catch (error) {
    throw error;
  }
});



instructorsRouter.get('/me', async (req, res, next) => {
  try {
    console.log('/me route')
    // const instructor = await getInstructorById({id: req.instructor.id});
    const instructor = await getClassroomsByInstructorId({instructorId: req.instructor.id})
    if (instructor){
      res.send({
        success: true,
        instructor
      })
    }
  } catch (error) {
    throw error
  }
})

instructorsRouter.get("/:instructorId", requireAdmin, async (req, res, next) => {
  const { instructorId } = req.params;

  try{
    console.log('/:instructorId')
    const instructor = await getInstructorById({id: instructorId})
    if (instructor){
      res.send({
        success: true,
        instructor
      })
    }
  } catch (error) {
    throw error
  }
})

instructorsRouter.get('/:instructorId/classrooms', requireAdmin, async (req, res, next) => {
  try {
    console.log('/instructors/:instructorId/classrooms')
    // const instructor = await getInstructorById({id: req.instructor.id});
    const instructor = await getClassroomsByInstructorId({instructorId: req.instructor.id})
    if (instructor){
      res.send({
        success: true,
        instructor
      })
    }
  } catch (error) {
    throw error
  }
})

// studentsRouter.get('/:instructorId',  async(req, res, next) => {
//   try{

//       //Only person who should be able to access this route is the
//       //instructor in question or the admin
//       const { instructorId } = req.params
//       const students = await getStudentsByInstructor({id:instructorId})
//   res.send({success: true, students})
//   } catch (error){
//       console.log(error)
//       next({message: 'error'})
//   }
// })


instructorsRouter.delete("/:instructorId", requireAdminOrAuthorizedUser, async (req, res, next) => {
  const { instructorId } = req.params;
 
  if (req.instructor.isAdmin || req.instructor.id === instructorId){
    const deletedUser = await deleteInstructor({instructorId});
    if (deletedUser){
      res.send({success: true, deletedUser})
    } else {
      next(ApiError.internal('Something went wrong'))
    }
  }
  return
// I need to check to see if the user is either the same user or is an admin before deleting

})

instructorsRouter.post("/register", async (req, res, next) => {
  try {
    const { name, username, password, isAdmin, email } = req.body;
    const _user = await getInstructorByUsername({username: username});

    //This function is currently broken because emails are enrypted
    // const _email = await getInstructorByEmail({email:email})
    if (_user) {
      next(ApiError.badRequest("A user by that username already exists"))
      return;
    } 
    else {
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
        JWT_SECRET,
        {
        expiresIn: JWT_EXPIRES_IN
        }
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
    const user = await loginInstructor({ username, password });
    if (!user) {
      next(ApiError.badRequest('Username or password is incorrect'))
      return;
    } else {
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET)
      res.send({
        success: true,
        user,
        token
      });
    }
  } catch (error) {
    throw error;
  }
});



module.exports = instructorsRouter;
