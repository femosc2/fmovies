import { Request, Response } from 'express';
import { db } from '../../index';
import axios from "axios";

interface IMovie {
  Title: string,
  Year: string,
  Runtime: string,
  Genre: string[],
  Director: string,
  Actors: string[],
  Plot: string,
  ImdbRating: string,
  FemoRating: string,
  Watched: Date,
  Poster: string,
}

export const createMovie = (req: Request, res: Response): Response<any> => {
  const FemoRating = req.query.rating.toString();
  axios.get(`http://www.omdbapi.com/?t=${req.query.title.toString()}&apikey=${process.env.OMDB_APIKEY}`).then((r) => {
    let newMovie: IMovie;
    const { Title, Runtime, Year, Genre, Director, Actors, Plot, imdbRating, Poster} = r.data;

    console.log(r.data.Poster);

    try {
      newMovie = {
        Title,
        Runtime,
        Year,
        Genre: Genre.split(","),
        Director,
        Actors: Actors.split(","),
        Plot,
        ImdbRating: imdbRating,
        FemoRating,
        Watched: new Date(),
        Poster
      }
      db.ref(`${Title}`).set(newMovie);
      return res.status(201).send(newMovie);
    } catch {
      return res.status(400).send("Movie not found")
    }
  })
  return null;
}