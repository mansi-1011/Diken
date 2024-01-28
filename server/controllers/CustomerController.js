import "dotenv/config";
import bcrypt from "bcrypt";
import customer from "../models/customer.model.js";
import lodash from "lodash";
import Jwt from "jsonwebtoken";
import useragent from "express-useragent";

const { toLower } = lodash;
export default class CustomerController {
  static async register(req, res) {
    try {
      const { name, email, password, telephone, status } = req.body;
      const existingCustomer = await customer.findByEmail(toLower(email));
      if (existingCustomer) {
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

        await customer.create({
          name: toLower(name),
          email: toLower(email),
          password: newPassword,
          telephone,
          ip: 0,
          status,
          token: null,
          create_at: formattedDate,
          device_info: null,
        });

        res.json({
          status: true,
          message: "User Created Successfully....",
        });
      }
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message: error.message || "Email Already in Use",
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const customerData = await customer.findByEmail(toLower(email));
      if (!customerData) {
        res.json({
          status: false,
          message: "Invalid User Email..",
        });
      } else {
        const PassConfirm = await bcrypt.compare(
          password,
          customerData.password
        );
        if (PassConfirm) {
          const token = Jwt.sign(
            {
              name: customerData.name,
              email: customerData.email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: 60 * process.env.JWT_TIME,
            }
          );
          console.log(req.body.device_info, "device_info");
          //   if (!customerData.device_info || customerData.device_info === "UNSET") {
          //     // Assuming model_account_customer is accessible here
          //     const hello = model_account_customer.editDeviceInfo(
          //       req.body.device_info
          //     );
          //     console.log(hello, "hello");
          //   } else {
          //     // Checking if device_info is not empty and not 'UNSET'
          //     const unserializedData = JSON.parse(customerData.device_info);
          //     customerData.device_info = unserializedData;

          //     if (unserializedData !== req.body.device_info) {
          //       // Log out the user and set error message
          //       // Implement your customer logout logic here
          //       const json = {
          //         error: "Invalid device, please login from registered device",
          //         success: false,
          //       };
          //       // Handle the JSON object as needed
          //       res.json(json);
          //       return;
          //     }
          //   }

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

  static async getCustomer(req, res) {
    try {
      const { draw, start, length, order, search, columns } = req.query;
      let column;
      let column_sort_order;
      let search_value = "";

      if (typeof order === "undefined") {
        column = "customer_id";
        column_sort_order = "DESC";
      } else {
        search_value = search["value"] || "";
        const column_index = order[0]["column"];
        column = columns[column_index]["data"];
        column_sort_order = order[0]["dir"];
      }

      const search_query = search_value
        ? `AND (name LIKE '%${search_value}%'
              OR email LIKE '%${search_value}%'
              OR telephone LIKE '%${search_value}%'
              OR ip LIKE '%${search_value}%'
            ) `
        : "";

      const offset = start || 0;
      const pageSize = length || 10;

      const conditions = `1 ${search_query}`;

      const customers = await customer.findAll(
        conditions,
        `${column} ${column_sort_order}`,
        pageSize,
        offset
      );

      const total_customers = await customer.count(conditions);

      const total_filter_request = total_customers;

      if (customers.length <= 0) {
        res.json({
          status: false,
          message: "No data found",
        });
      }

      res.status(200).json({
        draw: draw,
        iTotalRecords: total_customers,
        iTotalDisplayRecords: total_filter_request,
        aaData: customers,
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
      });
    }
  }
}
