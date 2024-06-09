import jwt from 'jsonwebtoken';

const cookieJwtAuth = (request, response, next) => {
  const token = request.cookies.token;
  if (!token) {
    return response.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, 'secret'); // Adjust the secret key
    request.user = user;
    next();
  } catch (error) {
    response.clearCookie('token');
    return response.status(401).json({ error: 'Unauthorized' });
  }
};

export default cookieJwtAuth;
