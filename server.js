import express from 'express';
import multer from 'multer';
import { __port__ } from './config/constants.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';

connectDB();

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.any());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Build With Innovation 1.0.0');
});

app.use('/api/users', userRoutes);

// app.get('*', (req, res) => {
//   res.json({ message: 'Not Found' });
// });

app.use(notFound);
app.use(errorHandler);

app.listen(__port__, () => {
  console.log(`BWI-API listening on ${__port__}`);
});
