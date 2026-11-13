export const withErrorHandling = (handler) => async (request, response, next) => {
  try {
    await handler(request, response, next);
  } catch (error) {
    next(error);
  }
};

export const createNotFoundError = (resource) => {
  const error = new Error(`${resource} not found.`);
  error.status = 404;
  return error;
};

export const parseRouteId = (value, resource) => {
  if (!/^\d+$/.test(value)) {
    throw createNotFoundError(resource);
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    throw createNotFoundError(resource);
  }

  return id;
};
