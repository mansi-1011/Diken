import "dotenv/config";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import lodash from "lodash";
import Jwt from "jsonwebtoken";

const { toLower } = lodash;
export default class UserController {
  static async test(req, res) {
    res.json({
      message: "This is From Routes",
    });
  }

  static async register(req, res) {
    try {
      const { name, email, password, telephone, status } = req.body;
      const { userIpAddress } = req;
      const existingUser = await User.findByEmail(toLower(email));
      if (existingUser) {
        res.json({
          status: false,
          message: "Email Already in Use",
        });
      } else {
        var newPassword = await bcrypt.hash(password, 10);
        const formattedDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        await User.create({
          name: toLower(name),
          email: toLower(email),
          password: newPassword,
          telephone,
          ip: userIpAddress,
          status,
          create_at: formattedDate,
        });

        res.json({
          status: true,
          message: "User Created Successfully....",
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: error.message || "Email Already in Use",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(toLower(email));
      if (!user) {
        res.json({
          status: false,
          message: "Invalid User Email..",
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

          res.json({
            status: true,
            message: "User Logged In...",
            token: token,
          });
        } else {
          res.json({
            status: false,
            message: "Incorrect Password. Please try again.",
          });
        }
      }
    } catch (error) {
      res.json({
        status: false,
        message:
          error.message || "An error occurred while processing the login.",
      });
    }
  }
}
