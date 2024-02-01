import queryAsync from "../lib/db.js";

const customerOrderCourseModel = {
  create: async (customerCourse) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `customer_order_courses`(`customer_id`, `course_id`, `customer_order_courses_status`, `customer_order_courses_expired_date`, `create_at`) VALUES (? , ? , ? , ? , ?)",
        [
          customerCourse.customer_id,
          customerCourse.course_id,
          customerCourse.customer_order_courses_status,
          customerCourse.customer_order_courses_expired_date,
          customerCourse.create_at,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  update: async (course) => {
    try {
      const result = await queryAsync(
        "UPDATE `customer_order_courses` SET `customer_order_courses_status`=?, `customer_order_courses_expired_date`=?, `update_at`=? WHERE `customer_order_courses_id`=?",
        [
          course.customer_order_courses_status,
          course.customer_order_courses_expired_date,
          course.update_at,
          course.customer_order_courses_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  findAllWithCourseData: async (customer_id) => {
    try {
      const query = `
      SELECT
          cust.*,coc.*,
          CONCAT('[', GROUP_CONCAT(
              '{"course_id":', c.course_id,
              ',"course_name":"', c.course_name,
              '","course_description":"', c.course_description,
              '","course_expired_days":"', c.course_expired_days,
              '","course_image":"', c.course_image,
              '","course_length":', c.course_length,
              ',"course_number_of_videos":', c.course_number_of_videos, 
              ',"course_price":', c.course_price,
              ',"course_status":', c.course_status,
              '}'
          ), ']') AS courses
      FROM
          customer cust
      LEFT JOIN
          customer_order_courses coc ON cust.customer_id = coc.customer_id
      LEFT JOIN
          courses c ON coc.course_id = c.course_id
      WHERE
          cust.customer_id = ?
      GROUP BY
          cust.customer_id, cust.name, cust.email;
      `;

      const coursesWithCourseData = await queryAsync(query, [customer_id]);
      return coursesWithCourseData;
    } catch (error) {
      throw error;
    }
  },

  deleteMultipleByCustomerId: async (customerIds) => {
    try {
      if (!Array.isArray(customerIds) || customerIds.length === 0) {
        throw new Error("Invalid or empty 'customerIds' array.");
      }

      const query = `
        DELETE FROM customer_order_courses
        WHERE customer_id IN (?);
      `;

      const result = await queryAsync(query, [customerIds]);

      return result.affectedRows > 0 ? customerIds : [];
    } catch (error) {
      throw error;
    }
  },
};

export default customerOrderCourseModel;
