import mongoose from 'mongoose';
import express, { Application } from 'express';
import noCache from 'nocache';

import userRoute from './routes/userRoute';
import adminRoute from './routes/adminRoute';

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user_management_system')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Initialize Express app
const app: Application = express();

// Middleware
app.use(noCache());

// Routes
app.use('/', userRoute);
app.use('/admin', adminRoute);

// Start the server
const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Running..http://localhost:${PORT}/`);
});
