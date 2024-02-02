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

      const courseId = await courseModel.create({
        course_name,
        course_description,
        course_expired_days,
        course_image: image_path,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
        create_at: formattedDate,
      });

      // if (course_data && course_data.length > 0) {
      //   for (const data of course_data) {
      //     await courseDataModel.create({
      //       course_id: courseId,
      //       course_data_type: data.course_data_type,
      //       course_data_title: data.course_data_title,
      //       course_data_url: data.course_data_url,
      //       course_data_length: data.course_data_length,
      //       // course_data_count_of_view: data.course_count_of_view,
      //       course_data_sort_order:index,
      //       create_at: formattedDate,
      //     });
      //   }
      // }

      if (course_data && course_data.length > 0) {
        for (const [index, data] of course_data.entries()) {
          await courseDataModel.create({
            course_id: courseId,
            course_data_type: data.course_data_type,
            course_data_title: data.course_data_title,
            course_data_url: data.course_data_url,
            course_data_length: data.course_data_length,
            course_data_sort_order: index,
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

      // const offset = start || 0;
      // const page = Math.floor(start / length);
      // const pageSize = length || 10;
      const page = isNaN(start)
        ? 0
        : Math.floor(Number(start) / (length || 10));
      const pageSize = isNaN(length) ? 10 : Number(length);

      const offset = page * pageSize;
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
      // const { course, course_data } = JSON.parse(req.body.course_data);

      const data = {
        course: {
          course_id: 15,
          course_name: "eweweerere",
          course_description: "erere",
          course_expired_days: "23",
          course_length: "232",
          course_number_of_videos: "23",
          course_price: "34",
          course_status: "1",
        },
        course_data: [
          {
            course_data_id: 5,
            course_data_type: "pdf",
            course_data_title: "ronak",
            course_data_url:
              "https://stackoverflow.com/questions/77066715/setting-image-path-correctly-in-nodejs-and-displaying-it-in-react",
            course_data_length: "343",
            course_count_of_view: "",
            course_sort_order: "2",
          },
          {
            course_data_id: 4,
            course_data_type: "mp4",
            course_data_title: "bansi",
            course_data_url:
              "https://stackoverflow.com/questions/77066715/setting-image-path-correctly-in-nodejs-and-displaying-it-in-react",
            course_data_length: "bansi",
            course_count_of_view: "",
            course_sort_order: "2",
          },
          {
            course_data_id: 7,
            course_data_type: "pdf",
            course_data_title: "meet",
            course_data_url:
              "https://stackoverflow.com/questions/77066715/setting-image-path-correctly-in-nodejs-and-displaying-it-in-react",
            course_data_length: "23",
            course_count_of_view: "",
            course_sort_order: "2",
          },
          {
            course_data_id: 6,
            course_data_type: "mp4",
            course_data_title: "weer",
            course_data_url:
              "https://stackoverflow.com/questions/77066715/setting-image-path-correctly-in-nodejs-and-displaying-it-in-react",
            course_data_length: "23",
            course_count_of_view: "",
            course_sort_order: "2",
          },
        ],
      };

      const { course, course_data } = data;
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
      var image = "";
      if (req.files !== undefined) {
        image = _.first(req.files.course_image);
      }
      var new_image = "";
      if (image !== undefined) {
        new_image = `${image.destination}/${image.filename}`;
        try {
          fs.unlinkSync(`../server/${courses.course_image}`, (err) => {
            if (err) throw err;
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = courses.course_image;
      }

      const formattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      await courseModel.update({
        course_id,
        course_name,
        course_description,
        course_expired_days,
        // course_image: new_image,
        course_length,
        course_number_of_videos,
        course_price,
        course_status,
        update_at: formattedDate,
      });

      // if (course_data && course_data.length > 0) {
      //   for (const data of course_data) {
      //     await courseDataModel.update({
      //       course_data_type: data.course_data_type,
      //       course_data_title: data.course_data_title,
      //       course_data_url: data.course_data_url,
      //       course_data_length: data.course_data_length,
      //       // course_data_count_of_view: data.course_count_of_view,
      //       course_data_sort_order: data.course_sort_order,
      //       update_at: formattedDate,
      //       course_data_id: data.course_data_id,
      //     });
      //   }
      // }

      for (const [index, data] of course_data.entries()) {
        await courseDataModel.update({
          course_data_type: data.course_data_type,
          course_data_title: data.course_data_title,
          course_data_url: data.course_data_url,
          course_data_length: data.course_data_length,
          course_data_sort_order: index,
          update_at: formattedDate,
          course_data_id: data.course_data_id,
        });
      }

      res.json({
        status: true,
        message: "User Updated Successfully....",
      });
    } catch (error) {
      console.log(error);
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

  static async getCourseByCustomer(req, res) {
    try {
      const customer_id = req.params.id;

      const courses = await courseModel.findByCustomerId(customer_id);

      if (!courses || courses.length === 0) {
        return res.json({
          status: true,
          courseData: [],
          message: "No courses found for the given customer ID.",
        });
      }

      const course_ids = courses.map((course) => course.course_id);
      const courses_data = await courseModel.findByCourseIds(course_ids);

      const combinedArray = courses.map((course) => {
        const matchingCourseData = courses_data.find(
          (data) => data.course_id === course.course_id
        );

        return {
          ...course,
          ...matchingCourseData,
        };
      });

      if (combinedArray.length > 0) {
        const dataArray = combinedArray.map((course) => {
          if (
            course.course_data !== null &&
            typeof course.course_data === "string"
          ) {
            course.course_data = JSON.parse(course.course_data);
          }
          return course;
        });

        res.json({
          status: true,
          courseData: dataArray,
          message: "Customer Course Data Get Successfully!!",
        });
      } else {
        res.json({
          status: true,
          courseData: [],
          message: "No course data found for the given customer ID.",
        });
      }
    } catch (error) {
      console.log(error, "error");
      res.json({
        status: false,
        message:
          error.message || "An error occurred while fetching customer courses.",
      });
    }
  }

  static async courseVideoCount(req, res) {
    try {
      const course_data_id = req.params.id;

      const courseData = await courseDataModel.getCourseDataById(
        course_data_id
      );

      const course_data_count_of_view =
        courseData.course_data_count_of_view + 1;

      const data = await courseDataModel.updateCourseVideoCount({
        course_data_count_of_view,
        course_data_id,
      });

      res.json({
        status: true,
        message: "Course Count Plus Successfully!!",
      });
    } catch (error) {
      res.json({
        status: false,
        message:
          error.message || "An error occurred while fetching customer courses.",
      });
    }
  }
}
