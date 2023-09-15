export const frontendMiddleware = (req, res, next) => {
    // Add user authentication status to the response object
    res.locals.isAuthenticated = req.session.user ? true : false;
  
    // Add user information to the response object if authenticated
    if (res.locals.isAuthenticated) {
      res.locals.user = {
        id: req.session.user.id,
        username: req.session.user.username,
      };
    }
  
    next(); // Continue to the next middleware or route handler
  };
  