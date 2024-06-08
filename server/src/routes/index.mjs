import { Router } from 'express';
import userRouter from './users.mjs'
import couplesRouter from './couples.mjs'
import itemsRouter from './items.mjs'

const router = Router();

router.use(couplesRouter);
router.use(itemsRouter);
router.use(userRouter);

export default router;