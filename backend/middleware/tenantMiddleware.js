const tenantMiddleware = (req, _res, next) => {
  req.tenantId =
    req.headers["x-tenant-id"] ||
    req.query.tenantId ||
    req.body?.tenantId ||
    "public";

  next();
};

export default tenantMiddleware;
