import express from 'express';
import { home } from '../controllers/rootController';

const rootRouter = express.Router();

rootRouter.get('/', home);

export default rootRouter;
