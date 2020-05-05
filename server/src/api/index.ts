import express from 'express';
import movieRouter from './routes/movieRoute';
const api = express();

api.use('/movie', movieRouter)

export default api;