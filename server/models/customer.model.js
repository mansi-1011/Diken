import queryAsync from "../lib/db.js";
import lodash from "lodash";
const { _ } = lodash;

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
};

export default customer;
