const notFound = (req, _res, next) => {
  if (req.originalUrl === "/favicon.ico") {
    next();
    return;
  }

  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, _next) => {
  const resolvedError =
    error instanceof Error
      ? error
      : Object.assign(new Error("Something went wrong."), {
          originalError: error,
        });

  let statusCode = resolvedError.statusCode || 500;
  let message = resolvedError.message || "Something went wrong.";

  if (resolvedError.code === 11000) {
    statusCode = 409;
    const duplicateField =
      Object.keys(resolvedError.keyPattern || {})[0] || "field";
    message = `${duplicateField} already exists.`;
  }

  if (resolvedError.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(resolvedError.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (resolvedError.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${resolvedError.path}.`;
  }

  console.error("API Error:", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    name: resolvedError.name,
    code: resolvedError.code,
    originalError: resolvedError.originalError,
    stack: resolvedError.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : resolvedError.stack,
  });
};

export { notFound, errorHandler };
