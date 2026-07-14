import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'https://ai-interviewer-brown-nu.vercel.app'],
    credentials: true,
}));

/* import all the routes here */
import authRouter from './routes/auth.routes.js';
import interviewRouter from './routes/interview.routes.js';

/* using all the routes */
app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);


export default app;