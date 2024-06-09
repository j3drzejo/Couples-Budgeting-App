import { Router } from 'express';
import cookieJWTAuth from '../middleware/cookieJWTAuth.mjs';
import { insertItem } from '../db/itemsHandler.mjs'
const router = Router();


router.post('/api/items/insert', cookieJWTAuth, (request, response) => {
  const userId = request.user.userId;  // Assuming `userId` is attached to `request.user` by `cookieJWTAuth`
  const { description, value } = request.body;

  if (!description || !value) {
    return response.status(400).json({ error: 'Description and value are required' });
  }

  insertItem(userId, description, value, (error, result) => {
    if (error) {
      response.status(500).json({ error: 'Failed to insert item' });
    } else {
      response.status(201).json({ success: 'Item inserted', itemId: result });
    }
  });
});

export default router;
