import { Router } from 'express';
import { checkIfInCouple, findCouple, createCouple, joinCouple } from '../db/couplesHandler.mjs'
import cookieJWTAuth from '../middleware/cookieJWTAuth.mjs'
const router = Router();

router.post('/api/couples/create', cookieJWTAuth, (request, response) => {
  const userId = request.user.userId;
  checkIfInCouple(userId, (error, row) => {
    if (error) {
      response.status(500).json({ error: 'Failed to check couple status' });
    } else if (row) {
      response.status(400).json({ error: 'User is already in a couple' });
    } else {
      createCouple(userId, (error, result) => {
        if (error) {
          response.status(500).json({ error: 'Failed to create couple', e: error});
        } else {
          response.status(201).json({ success: 'Couple created', coupleId: result.id });
        }
      });
    }
  });
});

export default router;
