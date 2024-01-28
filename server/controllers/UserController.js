import "dotenv/config";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import lodash from "lodash";
import Jwt from "jsonwebtoken";

const { toLower } = lodash;
export default class UserController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findByUsername(toLower(username));
      if (!user) {
        res.json({
          status: false,
          message: "Invalid User Name..",
        });
      } else {
        const PassConfirm = await bcrypt.compare(password, user.password);
        if (PassConfirm) {
          const token = Jwt.sign(
            {
              name: user.name,
              email: user.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: 60 * process.env.JWT_TIME,
            }
          );
          res.cookie("authToken", token, {
            maxAge: 60 * process.env.JWT_TIME,
            secure: true,
            sameSite: "None",
            path: "/",
          });

          res.cookie("user_role", user.role_name, {
            maxAge: 60 * process.env.JWT_TIME,
            secure: true,
            sameSite: "None",
            path: "/",
          });
          res.json({
            status: true,
            message: "User Logged In...",
            token: token,
            user: user,
          });
        } else {
          res.json({
            status: false,
            message: "Incorrect Password. Please try again.",
          });
        }
      }
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message:
          error.message || "An error occurred while processing the login.",
      });
    }
  }
}
