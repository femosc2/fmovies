import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swagger';
import api from './api';
import firebase from 'firebase/app';
import 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
};

firebase.initializeApp(config);

export const db = firebase.database();

const app = express();

app.use(function (req, res, next) { // Allows for easy testing
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const port = 8081; // default port to listen
app.use('/api/v1', api);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
});