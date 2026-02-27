class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errorCode = null, details = null) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.error = {
      code: errorCode,
      details: details
    };
  }
}

export default ApiError;