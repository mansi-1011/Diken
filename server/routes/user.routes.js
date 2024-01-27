import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import UserController from "../controllers/UserController.js";

const route = express.Router();

route.use(cors());
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
