import { Router } from 'express';
import { createMovie, createMovieById } from '../controllers/movieController';
const movieRouter = Router();

movieRouter.post('/', createMovie);
movieRouter.post('/id', createMovieById);

export default movieRouter;