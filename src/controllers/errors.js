export const showTestErrorPage = (request, response, next) => {
  if (request.app.get('env') !== 'development') {
    return next();
  }

  const error = new Error('This is a test error.');
  error.status = 500;
  next(error);
};
