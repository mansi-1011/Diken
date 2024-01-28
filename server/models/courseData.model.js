import queryAsync from "../lib/db.js";

const coursesData = {
  create: async (courseData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `course_data`(`course_id`, `course_data_type`, `course_data_title`, `course_data_url`, `course_data_length`, `course_data_count_of_view`, `course_data_sort_order`, `create_at`) VALUES (?,?,?,?,?,?,?,?)",
        [
          courseData.course_id,
          courseData.course_data_type,
          courseData.course_data_title,
          courseData.course_data_url,
          courseData.course_data_length,
          courseData.course_data_count_of_view,
          courseData.course_data_sort_order,
          courseData.create_at,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  update: async (customerData) => {
    try {
      const result = await queryAsync(
        "UPDATE `courses` SET `name`=?, `email`=?, `telephone`=?,`ip`=?, `status`=?, `token`=?, `update_at`=?, `device_info`=? WHERE `customer_id`=?",
        [
          customerData.name,
          customerData.email,
          customerData.telephone,
          customerData.ip,
          customerData.status,
          customerData.token,
          customerData.update_at,
          customerData.device_info,
          customerData.customer_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

export default coursesData;
