import queryAsync from "../lib/db.js";
import lodash from "lodash";
const { _ } = lodash;

const User = {
  findByUsername: async (username) => {
    const query = `
      SELECT user.*, user_role.role_name
      FROM user
      LEFT JOIN user_role ON user.user_role_id = user_role.role_id
      WHERE user.username = ?;
    `;

    const rows = await queryAsync(query, [username]);
    return rows[0];
  },
};

export default User;
