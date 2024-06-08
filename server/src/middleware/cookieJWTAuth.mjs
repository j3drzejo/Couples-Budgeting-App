import jwt from 'jsonwebtoken';

const cookieJwtAuth = (request, response, next) => {
  const token = request.cookies.token; // The cookie name should match the one set in the login route
  if (!token) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, 'secret'); // Adjust the secret key
    request.user = user;
    next();
  } catch (error) {
    response.clearCookie('token'); // Make sure the cookie name matches
    next(error);
  }
};

export default cookieJwtAuth;
