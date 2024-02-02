import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";

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

// Create a folder for storing images if it doesn't exist
const uploadFolder = "storage/public/images/course";

/*------------ Multer Images Code  ------------ */

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    if (ext == "jpg" || ext == "jpeg" || ext == "png") {
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    } else {
      cb(new Error("Not a valid extension..."), false);
    }
  },
});
const upload = multer({
  storage: multerStorage,
});
const UploadFiles = upload.fields([
  {
    name: "course_image",
  },
]);

route.post("/insert", auth, UploadFiles, CourseController.insertCourse);

route.get("/", auth, CourseController.getcourse);

route.get("/edit/:id", auth, CourseController.editCourse);

route.put("/upd", auth, UploadFiles, CourseController.updateCourse);

route.delete("/mlpdelete", auth, CourseController.deleteMultipleCourse);

// mobile api routes Start

route.get("/getcours/:id", CourseController.getCourseByCustomer);

route.get("/vidcount/:id", CourseController.courseVideoCount)

// mobile api routes End

export default route;
