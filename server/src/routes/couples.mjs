import { Router } from 'express';
import { checkIfInCouple, findCouple, createCouple, joinCouple, allCouples } from '../db/couplesHandler.mjs'
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
          response.status(500).json({ error: 'Failed to create couple', e: error });
        } else {
          response.status(201).json({ success: 'Couple created', coupleId: result.id });
        }
      });
    }
  });
});

router.put('/api/couples/join/:coupleID', cookieJWTAuth, (request, response) => {
  const coupleID = request.params.coupleID;
  const userID = request.user.userId;

  checkIfInCouple(userID, (error, row) => {
    if (error) {
      response.status(500).json({ error: 'Failed to check couple status' });
    } else if (row) {
      response.status(400).json({ error: 'User is already in a couple' });
    } else {
      joinCouple(coupleID, userID, (error, result) => {
        if (error) {
          console.error('Error joining couple:', error);
          response.status(500).json({ error: 'Failed to join couple' });
        } else {
          response.status(200).json({ success: 'Successfully joined couple', changes: result.changes });
        }
      });
    }
  });
});

router.put('/api/couples/leave', cookieJWTAuth, (request, response) => {
  const userId = request.user.userId;

  leaveCouple(userId, (error, result) => {
    if (error) {
      response.status(500).json({ error: 'Failed to leave couple' });
    } else {
      response.status(200).json({ success: 'Successfully left couple', changes: result.changes });
    }
  });
});

router.get('/api/couples', (request, response) => {
  allCouples((error, couples) => {
    if (error) {
      console.error('Error fetching couples:', error);
      response.status(500).json({ error: 'Failed to fetch couples' });
    } else {
      response.status(200).json(couples);
    }
  });
});

export default router;
