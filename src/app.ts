import express, { Express, Request, Response } from "express";
import logger from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import shortUrlRouter from "./router/shortUrl.router";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import options from './swagger';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');





const app: Express = express();
app.use(helmet());
app.use(logger("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
  })
);

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



app.use(
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
    origin: [
       "http://localhost:5173",
      "https://xutters.vercel.app"
    ],
  }),
);



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use("/", shortUrlRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// routes not found
app.use("*", (req: Request, res: Response) => {
  return res.status(404).json({ message: "Route not found" });
});

export default app;
