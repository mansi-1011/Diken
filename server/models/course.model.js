import queryAsync from "../lib/db.js";

const courses = {
  create: async (courseData) => {
    console.log(courseData ,"djfgdhf");
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

  findAll: async (conditions, order, limit, offset) => {
    const query = `
      SELECT * FROM courses
      WHERE ${conditions}
      ORDER BY ${order}
      LIMIT ${limit} OFFSET ${offset}
    `;
    const customers = await queryAsync(query);
    return customers;
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
      FROM customer c
      JOIN customer_address ca ON c.customer_id = ca.customer_id
      WHERE c.customer_id = ?`;

    const rows = await queryAsync(query, [customerId]);
    return rows;
  },

  updateUserInfo: async (customerId, userInfo) => {
    const { ip, device_info } = userInfo;

    const query = `
      UPDATE customer
      SET ip = ?, device_info = ?
      WHERE customer_id = ?;
    `;

    await queryAsync(query, [ip, device_info, customerId]);
  },
};

export default courses;
