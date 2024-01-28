import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import UserController from "../controllers/UserController.js";
import cookieParser from "cookie-parser"; 

const route = express.Router();
route.use(cookieParser());

route.use(
  cors({
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
route.use(
  bodyParser.json({
    extended: true,
  })
);
route.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

route.post("/auth", UserController.login);

export default route;
