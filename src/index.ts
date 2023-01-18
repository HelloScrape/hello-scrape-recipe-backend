import express from 'express';
import dotenv from 'dotenv';
import log from 'fancy-log';
import createError from 'http-errors';
import mongoose from 'mongoose';

import recipeRouter from './routes/recipeRouter';

dotenv.config();
mongoose.connect(process.env.MONGO_DB_URL as string);
const app = express();

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/recipe', recipeRouter);

// declare a route with a response
app.get('/', (req, res) => {
  res.json({ serverVersion: process.env.npm_package_version });
});

app.use(function (_req, _res, next) {
  next(createError(404));
});

// start the server
app.listen(process.env.PORT, () => {
  log(`server running : http://localhost:${process.env.PORT}`);
});
