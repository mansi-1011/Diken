import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import CourseController from "../controllers/CourseController.js";
import auth from "../middleware/auth.js";

const route = express.Router();

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
route.use(cookieParser());

// route.post("/insert", auth, CourseController.insertCourse);

// route.post("/auth", CustomerController.login);

// route.get("/", auth, CustomerController.getCustomer);

// route.get("/edit/:id", auth, CustomerController.editCustomer);

// route.post("/insert", auth, CustomerController.insertCustomer);

export default route;
