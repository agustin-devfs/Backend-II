import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import sessionRouter from './routes/sessionRouter.js';
import passport from './config/passport.js'; 
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Conexión a MongoDB
const uri = process.env.MONGO_URI;
mongoose.connect(uri);

// Middlewares de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializamos Passport
app.use(passport.initialize());

// Rutas para usuarios y sesiones
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
