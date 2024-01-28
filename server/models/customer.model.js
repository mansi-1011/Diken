import queryAsync from "../lib/db.js";

const customer = {
  create: async (customerData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO `customer`(`name`, `email`, `telephone`, `password`, `ip`, `status`, `token`, `create_at`, `device_info`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)",
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
      return result;
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
};

export default customer;
