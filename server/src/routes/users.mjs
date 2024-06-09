import { Router } from 'express';
import { findUser, insertUser, getAllUsers } from '../db/usersHandler.mjs';
import cookieJwtAuth from '../middleware/cookieJWTAuth.mjs'
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/api/users/all', (request, response) => {
  getAllUsers((err, users) => {
    if (err) {
      response.status(500).send({ error: 'Failed to retrieve users' });
    } else {
      response.status(200).json(users);
    }
  });
});

router.get('/api/users', (request, response) => {
  findUser((err, users) => {
    if (err) {
      response.status(500).send({ error: 'Failed to retrieve users' });
    } else {
      response.status(200).json(users);
    }
  });
});

router.post('/api/users/register', (request, response) => {
  const { username, password } = request.body;

  insertUser(username, password, (err, userId) => {
    if (err) {
      response.status(500).send({ error: 'Failed to insert user' });
    } else {
      response.status(201).json({ userId });
    }
  });
});

router.post('/api/users/login', (request, response) => {
  const { username, password } = request.body;

  findUser(username, password, (err, user) => {
    if (err) {
      response.status(500).send({ error: 'Internal server error' });
    } else if (!user) {
      response.status(401).send({ error: 'Invalid username or password' });
    } else {
      // User found and password matched
      // Generate a JWT token
      const token = jwt.sign({ userId: user.userid }, 'secret', { expiresIn: '1h' }); // Adjust the secret key and expiration time as needed

      // Set the token as a cookie in the response
      response.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Adjust the cookie options as needed

      response.status(200).send({ message: 'Login successful' });
    }
  });
});

router.get('/api/users/auth', cookieJwtAuth, (request, response) => {
  // If the middleware executes without throwing an error, it means the user is authenticated
  response.status(200).json({ message: 'Authenticated', userID: request.user.userId, token: request.cookies.token });
});

export default router;
