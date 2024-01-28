import queryAsync from "../lib/db.js";

const customer = {
  create: async (customerData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `courses`(`course_name`, `course_description`, `course_expired_days`, `course_expired_date`, `course_image`, `course_length`, `course_number_of_videos`, `course_price`, `course_status`, `create_at`) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          customerData.name,
          customerData.email,
          customerData.telephone,
          customerData.password,
          customerData.ip,
          customerData.status,
          customerData.token,
          customerData.create_at,
          customerData.device_info,
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
        "UPDATE `customer` SET `name`=?, `email`=?, `telephone`=?,`ip`=?, `status`=?, `token`=?, `update_at`=?, `device_info`=? WHERE `customer_id`=?",
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

  findByEmail: async (email) => {
    const rows = await queryAsync("SELECT * FROM customer WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },

  findAll: async (conditions, order, limit, offset) => {
    const query = `
      SELECT * FROM customer
      WHERE ${conditions}
      ORDER BY ${order}
      LIMIT ${limit} OFFSET ${offset}
    `;
    const customers = await queryAsync(query);
    return customers;
  },

  count: async (conditions) => {
    const query = `
      SELECT COUNT(*) FROM customer
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

export default customer;
