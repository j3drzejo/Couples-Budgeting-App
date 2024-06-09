import { checkIfInCouple } from '../db/couplesHandler.mjs'

const checkIfInCoupleMiddleware = (request, response, next) => {
  const userId = request.user.userId; // Assuming `userId` is attached to `request.user` by `cookieJWTAuth`

  checkIfInCouple(userId, (error, row) => {
    if (error) {
      response.status(500).json({ error: 'Failed to check couple status' });
    } else if (!row) {
      response.status(400).json({ error: 'User is not in any couple', notInCouple: true });
    } else {
      next(); // User is in a couple, proceed to the next middleware or route handler
    }
  });
};

export default checkIfInCoupleMiddleware;