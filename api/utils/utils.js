const ApiError = require("../error/ApiError");

function requireAuthorization(req, res, next) {
  if (!req.instructor) {
    next(
      ApiError.unauthorizedRequest(
        "You are not authorized to make this request"
      )
    );
    return;
  }
  next();
}

function requireAdmin(req, res, next) {
  console.log("Require Admin Middleware :");
  if (!req.instructor.isAdmin) {
    next(
      ApiError.unauthorizedRequest(
        "You are not authorized to make this request"
      )
    );
    return;
  }
  next();
}

// maybe write a utility function that takes in an instructor id
//Check to see if req.instructor.id is the same as the instructor id OR if the user is an admin

function requireAdminOrAuthorizedUser(req, res, next) {
  console.log("req.instructor", req.instructor);
  if (!req.instructor.isAdmin || !req.instructor) {
    next(ApiError.badRequest("You are not authorized to make that request"));
    return;
  }
  next();
}

module.exports = {
  requireAuthorization,
  requireAdmin,
  requireAdminOrAuthorizedUser,
};
