import express from 'express';
import cors from 'cors';
import 'dotenv/config';

//Initialize express app
const app = express();

//Middlewares
app.use(cors());

//Routes
app.get('/', (req, res) => {
  res.send("API is running");
})

//Port
const PORT = process.env.PORT || 5000;

//Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
