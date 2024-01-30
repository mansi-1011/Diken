import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import MediaController from "../controllers/MediaController.js";

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

/*------------ Get course Images Routes ------------ */

route.get("/course/:name", MediaController.getImages);

export default route;
