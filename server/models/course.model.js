import queryAsync from "../lib/db.js";

const courses = {
  create: async (courseData) => {
    console.log(courseData, "djfgdhf");
    try {
      const result = await queryAsync(
        "INSERT INTO `courses`(`course_name`, `course_description`, `course_expired_days`, `course_expired_date`, `course_image`, `course_length`, `course_number_of_videos`, `course_price`, `course_status`, `create_at`) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          courseData.course_name,
          courseData.course_description,
          courseData.course_expired_days,
          courseData.course_expired_date,
          courseData.course_image,
          courseData.course_length,
          courseData.course_number_of_videos,
          courseData.course_price,
          courseData.course_status,
          courseData.create_at,
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
        "UPDATE `courses` SET `name`=?, `email`=?, `telephone`=?,`ip`=?, `status`=?, `token`=?, `update_at`=?, `device_info`=? WHERE `customer_id`=?",
        [
          course.name,
          course.email,
          course.telephone,
          course.ip,
          course.status,
          course.token,
          course.update_at,
          course.device_info,
          course.customer_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  findAllWithCourseData: async (conditions, order, limit, offset) => {
    try {
      // const query = `
      //   SELECT c.*, cd.*
      //   FROM courses c
      //   LEFT JOIN course_data cd ON c.course_id = cd.course_id
      //   WHERE ${conditions}
      //   GROUP BY c.course_id
      //   ORDER BY c.${order}
      //   LIMIT ${limit} OFFSET ${offset}
      // `;
      const query = `
      SELECT c.course_id, c.course_name, c.course_description, c.course_expired_days, c.course_expired_date,
             c.course_image, c.course_length, c.course_number_of_videos, c.course_price, c.course_status,
             CONCAT('[', GROUP_CONCAT(
               CONCAT(
                 '{"course_data_id":', cd.course_data_id, 
                 ',"course_data_type":"', cd.course_data_type, 
                 '","course_data_title":"', cd.course_data_title, 
                 '","course_data_url":"', cd.course_data_url, 
                 '","course_data_length":"', cd.course_data_length, 
                 '","course_count_of_view":', cd.course_data_count_of_view, 
                 ',"course_sort_order":', cd.course_data_sort_order, '}'
               )
             ), ']') AS course_data
      FROM courses c
      LEFT JOIN course_data cd ON c.course_id = cd.course_id
      WHERE ${conditions}
      GROUP BY c.course_id
      ORDER BY c.${order} 
      LIMIT ${limit} OFFSET ${offset}
    `;

      const coursesWithCourseData = await queryAsync(query);
      return coursesWithCourseData;
    } catch (error) {
      throw error;
    }
  },

  count: async (conditions) => {
    const query = `
      SELECT COUNT(*) FROM courses
      WHERE ${conditions}
    `;
    const result = await queryAsync(query);
    return result[0]["COUNT(*)"];
  },

  findById: async (customerId) => {
    const query = `
      SELECT c.*, ca.*
      FROM course c
      JOIN course_data ca ON c.course_id = ca.course_id
      WHERE c.course_id = ?`;

    const rows = await queryAsync(query, [customerId]);
    return rows;
  },
};

export default courses;
