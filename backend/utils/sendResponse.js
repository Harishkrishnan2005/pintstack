const sendResponse = (res, statusCode, message, data = {}, meta = {}) =>
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    ...data,
    ...(Object.keys(meta).length ? { meta } : {}),
  });

export default sendResponse;
