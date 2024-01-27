import "dotenv/config";
import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/user.routes.js";

const URL = process.env.HOST_URL;
const HOST = process.env.HOST;
const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: `${process.env.FRONT_URL}`,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(express.json());

// Middleware to get the user's IP address
app.use((req, res, next) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  req.userIpAddress = ipAddress;
  next();
});

app.listen(PORT, HOST, () => {
  console.log(`Api Listenig at ${URL}:${PORT}`);
});

app.use("/api/user", userRoutes);
app.use("/api/customer", customerRoutes);
