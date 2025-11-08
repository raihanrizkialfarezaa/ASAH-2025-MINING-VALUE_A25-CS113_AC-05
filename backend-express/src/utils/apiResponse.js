class ApiResponse {
  constructor(statusCode, data, message = null, meta = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }

  static success(data, message = 'Success', statusCode = 200, meta = null) {
    return new ApiResponse(statusCode, data, message, meta);
  }

  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  static error(message, statusCode = 500, data = null) {
    return new ApiResponse(statusCode, data, message);
  }

  static badRequest(message = 'Bad request', errors = null) {
    return new ApiResponse(400, errors, message);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiResponse(401, null, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiResponse(403, null, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiResponse(404, null, message);
  }

  static validationError(errors, message = 'Validation failed') {
    return new ApiResponse(422, errors, message);
  }

  static paginated(data, pagination, message = 'Success') {
    return new ApiResponse(200, data, message, pagination);
  }
}

export default ApiResponse;
