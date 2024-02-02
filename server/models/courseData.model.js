import queryAsync from "../lib/db.js";

const courseDataModel = {
  create: async (courseData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `course_data`(`course_id`, `course_data_type`, `course_data_title`, `course_data_url`, `course_data_length`, `course_data_sort_order`, `create_at`) VALUES (?,?,?,?,?,?,?)",
        [
          courseData.course_id,
          courseData.course_data_type,
          courseData.course_data_title,
          courseData.course_data_url,
          courseData.course_data_length,
          // courseData.course_data_count_of_view,
          courseData.course_data_sort_order,
          courseData.create_at,
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  update: async (courseData) => {
    try {
      const result = await queryAsync(
        "UPDATE `course_data` SET `course_data_type`=?, `course_data_title`=?, `course_data_url`=?,`course_data_length`=?, `course_data_sort_order`=?, `update_at`=? WHERE `course_data_id`=?",
        [
          courseData.course_data_type,
          courseData.course_data_title,
          courseData.course_data_url,
          courseData.course_data_length,
          // courseData.course_data_count_of_view,
          courseData.course_data_sort_order,
          courseData.update_at,
          courseData.course_data_id,
        ]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
  findById: async (courseId) => {
    const query = `
      SELECT * FROM course_data
      WHERE course_id = ?  ORDER BY course_data_sort_order;`;

    const rows = await queryAsync(query, [courseId]);
    return rows;
  },

  deleteMultipleByCourseIds: async (courseIds) => {
    try {
      if (!Array.isArray(courseIds) || courseIds.length === 0) {
        throw new Error("Invalid or empty 'courseIds' array.");
      }

      const query = `
        DELETE FROM course_data
        WHERE course_id IN (?);
      `;

      const result = await queryAsync(query, [courseIds]);

      return result.affectedRows > 0 ? courseIds : [];
    } catch (error) {
      throw error;
    }
  },

  getCourseDataById: async (courseDataIds) => {
    try {
      const query = `
        select * FROM course_data
        WHERE course_data_id = (?);
      `;

      const [result] = await queryAsync(query, [courseDataIds]);

      return result;
    } catch (error) {
      throw error;
    }
  },
  updateCourseVideoCount: async (courseData) => {
    try {
      const result = await queryAsync(
        "UPDATE `course_data` SET `course_data_count_of_view`=? WHERE `course_data_id`=?",
        [courseData.course_data_count_of_view, courseData.course_data_id]
      );
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

export default courseDataModel;
