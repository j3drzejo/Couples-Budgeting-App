import express from 'express'
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`)
});