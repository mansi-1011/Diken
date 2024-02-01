import queryAsync from "../lib/db.js";

const courseModel = {
  create: async (course) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `courses`(`course_name`, `course_description`, `course_expired_days`, `course_image`, `course_length`, `course_number_of_videos`, `course_price`, `course_status`, `create_at`) VALUES (?,?,?,?,?,?,?,?,?)",
        [
          course.course_name,
          course.course_description,
          course.course_expired_days,
          course.course_image,
          course.course_length,
          course.course_number_of_videos,
          course.course_price,
          course.course_status,
          course.create_at,
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
        "UPDATE `courses` SET `course_name`=?, `course_description`=?, `course_expired_days`=?,`course_image`=?, `course_length`=?, `course_number_of_videos`=?, `course_price`=?, `course_status`=?, `update_at`=? WHERE `course_id`=?",
        [
          course.course_name,
          course.course_description,
          course.course_expired_days,
          course.course_image,
          course.course_length,
          course.course_number_of_videos,
          course.course_price,
          course.course_status,
          course.update_at,
          course.course_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  findAllWithCourseData: async (conditions, order, limit, offset) => {
    try {
      const query = `
      SELECT c.course_id, c.course_name, c.course_description, c.course_expired_days,
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

  findByCourseId: async (courseId) => {
    const query = `
      SELECT * FROM courses
      WHERE course_id = ?`;

    const [rows] = await queryAsync(query, [courseId]);

    // Ensure the field names match the expected field names in insertCustomer
    return {
      course_id: rows.course_id,
      course_name: rows.course_name,
      course_description: rows.course_description,
      course_expired_days: parseInt(rows.course_expired_days),
      course_image: rows.course_image,
      course_length: parseFloat(rows.course_length),
      course_number_of_videos: parseInt(rows.course_number_of_videos),
      course_price: parseFloat(rows.course_price),
      course_status: rows.course_status,
      create_at: rows.create_at,
      update_at: rows.update_at,
    };
  },

  count: async (conditions) => {
    const query = `
      SELECT COUNT(*) FROM courses
      WHERE ${conditions}
    `;
    const result = await queryAsync(query);
    return result[0]["COUNT(*)"];
  },

  findById: async (courseId) => {
    const query = `
      SELECT * FROM courses
      WHERE course_id = ?`;

    const [rows] = await queryAsync(query, [courseId]);
    return rows;
  },

  findByMultipleIds: async (courseId) => {
    const query = `SELECT * FROM courses WHERE course_id IN (?)`;

    try {
      const rows = await queryAsync(query, [courseId]);
      return rows;
    } catch (error) {
      throw new Error(`Error in findById: ${error.message}`);
    }
  },

  deleteMultiple: async (courseIds) => {
    try {
      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        throw new Error("Invalid or empty 'courseIds' array.");
      }

      const query = `
        DELETE FROM courses
        WHERE course_id IN (?);
      `;

      const result = await queryAsync(query, [courseIds]);

      return result.affectedRows > 0 ? courseIds : [];
    } catch (error) {
      throw error;
    }
  },
  findByCourseName: async (searchString) => {
    const query = `
      SELECT *
      FROM courses
      WHERE course_name LIKE ?;`;

    const rows = await queryAsync(query, [`%${searchString}%`]);
    return rows;
  },

  findByCustomerIid: async (customer_id) => {
    const query = `SELECT
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
      cust.customer_id, cust.name, cust.email;`;
    const coursesWithCourseData = await queryAsync(query, [customer_id]);
    return coursesWithCourseData;
  },
};

export default courseModel;
