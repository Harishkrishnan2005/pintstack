const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    if (error instanceof Error) {
      next(error);
      return;
    }

    const normalizedError = new Error(
      typeof error === "string" && error.trim()
        ? error
        : "Unhandled async failure."
    );
    normalizedError.statusCode = 500;
    normalizedError.originalError = error;
    next(normalizedError);
  }
};

export default asyncHandler;
