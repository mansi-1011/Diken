import queryAsync from "../lib/db.js";
import lodash from "lodash";
const { _ } = lodash;

const User = {
  findByUsername: async (username) => {
    const rows = await queryAsync("SELECT * FROM user WHERE  username = ?", [
      username,
    ]);
    return rows[0];
  },
};

export default User;