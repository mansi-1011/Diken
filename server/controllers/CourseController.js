import "dotenv/config";
import bcrypt from "bcrypt";
import lodash from "lodash";
import Jwt from "jsonwebtoken";

import courses from "../models/course.model.js";
import coursesData from "../models/courseData.model.js";

const { toLower } = lodash;
export default class CourseController {
  static async insertCourse(req, res) {
    try {
      const data = {
        course: {
          course_name: "Early Pregnancy(Ectopic, level-1 Included)",
          course_description: "hello",
          course_expired_days: 20,
          course_image: "storage/public/course_images/test.jpg",
          course_length: 1.5,
          course_number_of_videos: 4,
          course_price: 15000,
          course_status: 1,
        },
        course_data: [
          {
            course_data_type: "1",
            course_data_title: "01 GB  practical",
            course_data_url:
              "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB++practical.mp4",
            course_data_length: "55:34",
            course_count_of_view: 1,
            course_sort_order: 0,
          },
          {
            course_data_type: "2",
            course_data_title: "01 GB Ultrasound Class - I",
            course_data_url:
              "https://d2cg0216mv93jg.cloudfront.net/1+Gall+Bladder/01+GB+Ultrasound+Class+-+I.mp4",
            course_data_length: "55:34",
            course_count_of_view: 1,
            course_sort_order: 1,
          },
        ],
      };
      const { course, course_data } = data;
      //   const { general, address } = req.body;
      const {
        course_name,
        course_description,
        course_expired_days,
        course_image,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
      } = course;

      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let currentDate = new Date();
      let futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + course_expired_days);

      const course_expired_date = futureDate.toISOString().split("T")[0];

      const courseId = await courses.create({
        course_name,
        course_description,
        course_expired_days,
        course_expired_date: course_expired_date,
        course_image,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
        create_at: formattedDate,
      });

      if (course_data && course_data.length > 0) {
        for (const data of course_data) {
          await coursesData.create({
            course_id: courseId,
            course_data_type: data.course_data_type,
            course_data_title: data.course_data_title,
            course_data_url: data.course_data_url,
            course_data_length: data.course_data_length,
            course_data_count_of_view: data.course_count_of_view,
            course_data_sort_order: data.course_sort_order,
            create_at: formattedDate,
          });
        }
      }

      res.json({
        status: true,
        message: "Course Created Successfully....",
      });
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message: error.message,
      });
    }
  }

  static async getcourse(req, res) {
    try {
      const { draw, start, length, order, search, columns } = req.query;
      let column;
      let column_sort_order;
      let search_value = "";

      if (typeof order === "undefined") {
        column = "course_id";
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
}
