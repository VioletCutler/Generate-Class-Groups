const Express = require("express");
const instructorsRouter = Express.Router();
const {
  getAllInstructors,
  getInstructorByUsername,
  createInstructor,
  loginInstructor,
  getInstructorByEmail,
  getInstructorById,
  deleteInstructor
} = require("../db");
const {requireAuthorization, requireAdmin,   requireAdminOrAuthorizedUser} = require('./utils/utils')
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;
const ApiError = require('./error/ApiError')

instructorsRouter.use((req, res, next) => {
  console.log("A request has been made to /instructors");
  console.log('req.user:', req.instructor)
  next();
});

instructorsRouter.get("/", requireAdmin, async (req, res) => {
  try {
    console.log('GET /instructors')
    const instructors = await getAllInstructors();
    console.log('Instructors:', instructors)
    res.send({ success: true, instructors });
    return;
  } catch (error) {
    throw error;
  }
});

instructorsRouter.get("/:instructorId", requireAdmin, async (req, res, next) => {
  const { instructorId } = req.params;

  try{
    
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
    // else if (_email){
    //   next(ApiError.badRequest("A user has already used that email to sign up"))
    //   return;
    // } 
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
