class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorizedRequest(message) {
    return new ApiError(401, message);
  }

  static pageNotFound(message) {
    return new ApiError(404, message);
  }

  static internal(message) {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
