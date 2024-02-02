import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import CustomerController from "../controllers/CustomerController.js";
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

// mobile api routes Start

route.post("/auth", CustomerController.login);

route.post("/fogetpass", CustomerController.forgetPassword);

// mobile api routes End

// Web api routes Start

route.get("/", auth, CustomerController.getCustomer);

route.get("/edit/:id", auth, CustomerController.editCustomer);

route.post("/insert", auth, CustomerController.insertCustomer);

route.put("/upd", auth, CustomerController.updateCustomer);

route.delete("/mlpdelete", auth, CustomerController.deleteMultipleCustomers);

route.get("/country", auth, CustomerController.getCountry);

route.get("/country/:id", auth, CustomerController.getStateByCountryId);

route.get("/autocomplete", auth, CustomerController.searchByCourseName);

// Web api routes Start

export default route;
