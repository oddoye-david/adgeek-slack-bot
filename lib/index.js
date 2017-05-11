'use strict';

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';

dotenv.config({
  silent: true,
});


const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use('/webhooks', routes);

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`App listening on port ${PORT}...`);
});
