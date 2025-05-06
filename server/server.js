import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

//Initialize express app
const app = express();

//Connect to DATABASE
await connectDB();
await connectCloudinary()

//Middlewares
app.use(cors());
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => {
  res.send("API is running");
})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

//Port
const PORT = process.env.PORT || 5000;

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT} !`);
})
