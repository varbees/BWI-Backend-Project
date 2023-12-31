import express from 'express';
import cookieParser from 'cookie-parser';
import { __port__ } from './config/constants.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { swaggerUi, swaggerDocs } from './swagger.js';
import path from 'path';

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  const __dirname = path.resolve();
  const indexFilePath = path.join(__dirname, 'index.html');
  res.sendFile(indexFilePath);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(__port__, () => {
  console.log(`BWI-API listening on ${__port__}`);
});
