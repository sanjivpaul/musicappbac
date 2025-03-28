/**
 * A utility function to wrap async route handlers and middleware
 * Automatically catches errors and passes them to Express's error handler
 * @param {Function} requestHandler - The async function to wrap
 * @returns {Function} - A function that can be used as Express middleware
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
