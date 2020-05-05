import { Router } from 'express';
import { createMovie } from '../controllers/movieController';
const movieRouter = Router();

movieRouter.post('/', createMovie);

export default movieRouter;