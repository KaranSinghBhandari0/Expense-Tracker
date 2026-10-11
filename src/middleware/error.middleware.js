function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error.';
  let errors = [];

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier or value.';
    errors = [{ field: error.path, message: error.message }];
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists.';
  } else if (error.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON request body.';
  }

  if (statusCode >= 500) {
    console.error(error);
    message = process.env.NODE_ENV === 'production' ? 'Internal server error.' : message;
  }

  res.status(statusCode).json({ success: false, message, errors });
}

module.exports = { notFound, errorHandler };
