import "dotenv/config";
import bcrypt from "bcrypt";
import lodash from "lodash";
import Jwt from "jsonwebtoken";
import UAParser from "ua-parser-js";

import customer from "../models/customer.model.js";
import customerAddress from "../models/customerAddress.model.js";
import courseModel from "../models/course.model.js";
import customerOrderCourseModel from "../models/customerOrderCourse.model.js";

const { toLower } = lodash;
export default class CustomerController {
  static async insertCustomer(req, res) {
    try {
      // const data = {
      //   general: {
      //     name: "mansi",
      //     email: "mansi243@gmail.com",
      //     password: "12345",
      //     telephone: "8490828266",
      //     status: 1,
      //   },
      //   address: {
      //     first_name: "mansi",
      //     last_name: "patoliya3434",
      //     company: "test",
      //     company_id: "1454540",
      //     tax_id: "45445454",
      //     address_1: "120 test",
      //     address_2: "tewst 3r3ere",
      //     city: "surat",
      //     postcode: "390566576",
      //     country: "india",
      //     state: "gujarat",
      //   },
      //   payment_details: {
      //     payment_method: "case on delivery",
      //     payment_transaction_id: "34343",
      //   },
      //   course_order: [
      //     {
      //       course_id: 1,
      //       expier_date: "",
      //     },
      //     {
      //       course_id: 2,
      //       expier_date: "",
      //     },
      //   ],
      // };
      const { general, address, payment_details, course_order } = req.body;
      const { name, email, password, telephone, status } = general;
      const { payment_method, payment_transaction_id } = payment_details;

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
          payment_method,
          payment_transaction_id,
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

        if (course_order && course_order.length > 0) {
          for (const data of course_order) {
            const courseOrderInfo = await courseModel.findByCourseId(
              data.course_id
            );

            if (!courseOrderInfo) {
              return res.json({
                status: false,
                message: "Invalid course_id in course_order",
              });
            }
            let currentDate = new Date();
            let futureDate = new Date();
            futureDate.setDate(
              currentDate.getDate() + courseOrderInfo.course_expired_days
            );
            const course_expired_date = futureDate.toISOString().split("T")[0];
            // console.log(futureDate, "courseOrderInfo");

            await customerOrderCourseModel.create({
              customer_id: customerId,
              course_id: data.course_id,
              customer_order_courses_status: 1,
              customer_order_courses_expired_date: course_expired_date,
              create_at: formattedDate,
            });
          }
        }
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
      const customerData = await customerOrderCourseModel.findAllWithCourseData(
        customer_id
      );
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
      // const data = {
      //   general: {
      //     customer_id: 8,
      //     name: "mansi2343",
      //     email: "mansi243@gmail.com",
      //     password: "12345",
      //     telephone: "8490828266",
      //     status: 1,
      //   },
      //   address: {
      //     customer_id: 8,
      //     customer_address_id: 8,
      //     first_name: "mansi",
      //     last_name: "patoliya3434",
      //     company: "test",
      //     company_id: "1454540",
      //     tax_id: "45445454",
      //     address_1: "120 test",
      //     address_2: "tewst 3r3ere",
      //     city: "surat",
      //     postcode: "390566576",
      //     country: "india",
      //     state: "gujarat",
      //   },
      //   payment_details: {
      //     payment_method: "case on delivery",
      //     payment_transaction_id: "34343",
      //   },
      //   course_order: [
      //     {
      //       customer_order_courses_id: 10,
      //       customer_id: 8,
      //       course_id: 1,
      //       expier_date: "22-01-2024",
      //       customer_order_courses_status: 2,
      //     },
      //     {
      //       customer_order_courses_id: 11,
      //       customer_id: 8,
      //       course_id: 3,
      //       expier_date: "22-02-2024",
      //       customer_order_courses_status: 2,
      //     },
      //   ],
      // };
      const { general, address, payment_details, course_order } = req.body;
      const { customer_id, name, email, telephone, status } = general;
      const { payment_method, payment_transaction_id } = payment_details;
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
          // ip: 0,
          telephone,
          status,
          update_at: formattedDate,
          // device_info: null,
          payment_method,
          payment_transaction_id,
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
        if (course_order && course_order.length > 0) {
          for (const data of course_order) {
            const courseOrderInfo = await courseModel.findByCourseId(
              data.course_id
            );

            if (!courseOrderInfo) {
              return res.json({
                status: false,
                message: "Invalid course_id in course_order",
              });
            }
            // let currentDate = new Date();
            // let futureDate = new Date("");
            // futureDate.setDate(
            //   currentDate.getDate() + courseOrderInfo.course_expired_days
            // );
            // const course_expired_date = futureDate.toISOString().split("T")[0];

            const dateParts = data.expier_date.split("-");
            const formattedDate = new Date(
              `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            );

            const mysqlFormattedDate = formattedDate
              .toISOString()
              .split("T")[0];

            // const customer_order_courses_status = "";
            // if (data.customer_order_courses_status !== 1) {
            //   customer_order_courses_status = 2;
            // } else {
            //   customer_order_courses_status = 1;
            // }

            await customerOrderCourseModel.update({
              customer_order_courses_status: data.customer_order_courses_status,
              customer_order_courses_expired_date: mysqlFormattedDate,
              update_at: formattedDate,
              customer_order_courses_id: data.customer_order_courses_id,
            });
          }
        }
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
      // const ids = [6];
      const deletedCustomerIds = await customer.deleteMultiple(ids);
      await customerAddress.deleteMultipleByCustomerIds(deletedCustomerIds);
      await customerOrderCourseModel.deleteMultipleByCustomerId(ids);

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
            customer: customerData,
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
