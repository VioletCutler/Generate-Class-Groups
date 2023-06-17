const ApiError = require("./ApiError");

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).send({message: err.message});
    return;
  }
  res.status(500).send({message: "Something went wrong."});
}

module.exports = apiErrorHandler;
