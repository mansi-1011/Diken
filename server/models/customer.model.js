import queryAsync from "../lib/db.js";
import lodash from "lodash";
const { _ } = lodash;

const customer = {
  create: async (userData) => {
    try {
      const roleCheckResult = await queryAsync(
        "SELECT * FROM `user_role` WHERE `role_code` = ?",
        [userData.user_role]
      );

      const user_role = _.first(roleCheckResult);

      const result = await queryAsync(
        "INSERT INTO `customer`(`customer_role_id`, `name`, `email`, `telephone`, `password`, `ip`, `status`, `token`, `create_at`, `device_info`) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)",
        [
          user_role.role_id,
          userData.name,
          userData.email,
          userData.telephone,
          userData.password,
          userData.ip,
          userData.status,
          userData.token,
          userData.create_at,
          userData.device_info,
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
