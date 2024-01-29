import "dotenv/config";
import lodash from "lodash";

import courseModel from "../models/course.model.js";
import courseDataModel from "../models/courseData.model.js";
import fs from "fs";

const { _ } = lodash;
export default class CourseController {
  static async insertCourse(req, res) {
    try {
      const { course, course_data } = JSON.parse(req.body.course_data);
      const image = _.first(req.files.course_image);
      const image_path = `${image.destination}/${image.filename}`;
      const {
        course_name,
        course_description,
        course_expired_days,
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

      const courseId = await courseModel.create({
        course_name,
        course_description,
        course_expired_days,
        course_expired_date: course_expired_date,
        course_image: image_path,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
        create_at: formattedDate,
      });

      if (course_data && course_data.length > 0) {
        for (const data of course_data) {
          await courseDataModel.create({
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

      const coursesWithCourseData = await courseModel.findAllWithCourseData(
        conditions,
        `${column} ${column_sort_order}`,
        pageSize,
        offset
      );
      const total_courses = await courseModel.count(conditions);

      const total_filter_request = total_courses;

      if (coursesWithCourseData.length <= 0) {
        res.json({
          status: false,
          message: "No data found",
        });
      }

      res.status(200).json({
        draw: draw,
        iTotalRecords: total_courses,
        iTotalDisplayRecords: total_filter_request,
        aaData: coursesWithCourseData,
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
      });
    }
  }

  static async editCourse(req, res) {
    try {
      var course_id = req.params.id;
      const course = await courseModel.findById(course_id);
      const courseData = await courseDataModel.findById(course_id);
      console.log(courseData, "courseData");
      res.json({
        status: true,
        course: {
          course,
          courseData,
        },
      });
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message: "Somthing Wrong !!",
      });
    }
  }

  static async updateCourse(req, res) {
    try {
      const { course, course_data } = JSON.parse(req.body.course_data);

      const {
        course_id,
        course_name,
        course_description,
        course_expired_days,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
      } = course;
      const courses = await courseModel.findById(course_id);
      console.log(courses, "sgdfdgh");
      const image = _.first(req.files.course_image);
      var new_image = "";

      if (image !== undefined) {
        new_image = `${image.destination}/${image.filename}`;
        try {
          fs.unlinkSync(
            `../server/${courses.RowDataPacket.course_image}`,
            (err) => {
              if (err) throw err;
            }
          );
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = courses.RowDataPacket.course_image;
      }

      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      let currentDate = new Date();
      let futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + course_expired_days);

      const course_expired_date = futureDate.toISOString().split("T")[0];

      await courseModel.update({
        course_id,
        course_name,
        course_description,
        course_expired_days,
        course_expired_date,
        course_image: new_image,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
        update_at: formattedDate,
      });

      if (course_data && course_data.length > 0) {
        for (const data of course_data) {
          await courseDataModel.update({
            course_data_type: data.course_data_type,
            course_data_title: data.course_data_title,
            course_data_url: data.course_data_url,
            course_data_length: data.course_data_length,
            course_data_count_of_view: data.course_count_of_view,
            course_data_sort_order: data.course_sort_order,
            update_at: formattedDate,
            course_data_id: data.course_data_id,
          });
        }
      }

      res.json({
        status: true,
        message: "User Updated Successfully....",
      });
    } catch (error) {
      res.json({
        status: false,
        message: error.message,
      });
    }
  }

  static async deleteMultipleCourse(req, res) {
    try {
      const { ids } = req.body;
      // const ids = [2, 1];

      const courses = await courseModel.findByMultipleIds(ids);
      if (courses) {
        courses.forEach((course) => {
          var Images = course.course_image;
          fs.unlinkSync(`../server/${Images}`, (err) => {
            if (err) throw err;
          });
        });
      }
      const deletedCourseIds = await courseModel.deleteMultiple(ids);
      await courseDataModel.deleteMultipleByCourseIds(deletedCourseIds);

      res.json({
        status: true,
        message: "course and their course data deleted successfully.",
      });
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message: error.message || "An error occurred while deleting users.",
      });
    }
  }
}
