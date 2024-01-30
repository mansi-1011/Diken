import "dotenv/config";
import bcrypt from "bcrypt";
import lodash from "lodash";
import Jwt from "jsonwebtoken";
import UAParser from "ua-parser-js";

import customer from "../models/customer.model.js";
import customerAddress from "../models/customerAddress.model.js";
import courseModel from "../models/course.model.js";

const { toLower } = lodash;
export default class CustomerController {
  static async insertCustomer(req, res) {
    try {
      const { general, address } = req.body;
      const { name, email, password, telephone, status } = general;
      const {
        first_name,
        last_name,
        company,
        company_id,
        tax_id,
        address_1,
        address_2,
        city,
        postcode,
        country,
        state,
      } = address;
      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const existingCustomer = await customer.findByEmail(toLower(email));
      if (existingCustomer) {
        res.json({
          status: false,
          message: "Email Already in Use",
        });
      } else {
        var newPassword = await bcrypt.hash(password, 10);

        const customerId = await customer.create({
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

        await customerAddress.create({
          customer_id: customerId,
          first_name: first_name,
          last_name: last_name,
          company: company,
          company_id: company_id,
          tax_id: tax_id,
          address_1: address_1,
          address_2: address_2,
          city: city,
          postcode: postcode,
          country: country,
          state: state,
          create_at: formattedDate,
        });
        res.json({
          status: true,
          message: "Customer Created Successfully....",
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

  static async editCustomer(req, res) {
    try {
      var customer_id = req.params.id;
      const customerData = await customer.findById(customer_id);
      res.json({
        status: true,
        customer: customerData,
      });
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message: "Somthing Wrong !!",
      });
    }
  }

  static async updateCustomer(req, res) {
    try {
      const { general, address } = req.body;
      const { customer_id, name, email, password, telephone, status } = general;
      const {
        customer_address_id,
        first_name,
        last_name,
        company,
        company_id,
        tax_id,
        address_1,
        address_2,
        city,
        postcode,
        country,
        state,
      } = address;
      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      if (customer_id) {
        await customer.update({
          customer_id,
          name: toLower(name),
          email: toLower(email),
          // password: await bcrypt.hash(password, 10),
          telephone,
          status,
          update_at: formattedDate,
        });
        await customerAddress.update({
          customer_address_id: customer_address_id,
          first_name: first_name,
          last_name: last_name,
          company: company,
          company_id: company_id,
          tax_id: tax_id,
          address_1: address_1,
          address_2: address_2,
          city: city,
          postcode: postcode,
          country: country,
          state: state,
          update_at: formattedDate,
        });

        res.json({
          status: true,
          message: "Customer Updated Successfully....",
        });
      }
    } catch (error) {
      console.log(error, "error");

      res.json({
        status: false,
        message: error.message,
      });
    }
  }

  static async deleteMultipleCustomers(req, res) {
    try {
      const { ids } = req.body;
      const deletedCustomerIds = await customer.deleteMultiple(ids);
      await customerAddress.deleteMultipleByCustomerIds(deletedCustomerIds);

      res.json({
        status: true,
        message: "Customer and their addresses deleted successfully.",
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message || "An error occurred while deleting users.",
      });
    }
  }

  static async getCountry(req, res) {
    try {
      const countryData = await customer.country();

      res.json({
        status: true,
        country: countryData,
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message || "An error occurred while deleting users.",
      });
    }
  }

  static async getStateByCountryId(req, res) {
    try {
      const countryId = req.params.id;

      const states = await customer.getStatesByCountryId(countryId);

      res.json({
        status: true,
        states: states,
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message || "An error occurred while fetching states.",
      });
    }
  }

  static async searchByCourseName(req, res) {
    try {
      const searchString = req.query.filter;

      const courses = await courseModel.findByCourseName(searchString);

      res.json({
        status: true,
        courses: courses,
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message || "An error occurred while fetching states.",
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
          message: "Invalid Customer Email..",
        });
      } else {
        const PassConfirm = await bcrypt.compare(
          password,
          customerData.password
        );
        if (PassConfirm) {
          const userAgent = req.headers["user-agent"];
          const parser = new UAParser();
          const deviceInfo = parser.setUA(userAgent).getResult();
          const ip = req.userIpAddress;

          if (
            (!customerData.ip || customerData.ip === "0") &&
            (!customerData.device_info || customerData.device_info === "null")
          ) {
            customerData.ip = ip;
            await customer.updateUserInfo(customerData.customer_id, {
              ip: ip,
              device_info: JSON.stringify(deviceInfo),
            });
          }

          if (
            customerData.device_info &&
            customerData.device_info !== "UNSET"
          ) {
            const storedDeviceInfo = JSON.parse(customerData.device_info);
            if (
              JSON.stringify(deviceInfo) !== JSON.stringify(storedDeviceInfo)
            ) {
              return res.json({
                status: false,
                message: "Invalid device, please login from registered device.",
              });
            }
          }
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

          res.json({
            status: true,
            message: "Customer Logged In...",
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
      console.log(error, "error");
      res.json({
        status: false,
        message:
          error.message || "An error occurred while processing the login.",
      });
    }
  }
}
