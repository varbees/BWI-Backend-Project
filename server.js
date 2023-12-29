import express from 'express';
import { __port__ } from './config/constants.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Build With Innovation 1.0.0');
});

app.listen(__port__, () => {
  console.log(`BWI-API listening on ${__port__}`);
});
