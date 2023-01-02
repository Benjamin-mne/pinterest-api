import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import { createError } from './helpers/error.js';

import pinRoutes from './routes/pins.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());


// ===== CONNECT TO DB
mongoose.set("strictQuery", false);

const connect = () => {
    mongoose.connect(process.env.MONGO)
        .then(() => {console.log('Connected to Db!')})
        .catch(err => {
            throw err;
        });
}


// ===== ROUTES 
app.use('/api/auth', authRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/users', userRoutes);


// ===== HANDLE ERROR
app.use((err, req, res, next) => {
    const error = createError(err.status || 500, err.message || 'Something went wrong!')
    return res.status(error.status).json(error)
})


// ===== LISTEN SERVER
app.listen(PORT, () => {
    connect();
    console.log('Connected to Server!')
})
