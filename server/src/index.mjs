import express from 'express'
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import 'dotenv/config'

const app = express();

const corsOptions = {
  origin: process.env.DOMAIN, // Adjust the domain as needed
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});