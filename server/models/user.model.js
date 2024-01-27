import queryAsync from "../lib/db.js";

const User = {
  create: async (userData) => {
    try {
      const result = await queryAsync(
        "INSERT INTO users (name, email, password, telephone, ip, status, create_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          userData.name,
          userData.email,
          userData.password,
          userData.telephone,
          userData.ip,
          userData.status,
          userData.create_at,
        ]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  findByEmail: async (email) => {
    const rows = await queryAsync("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  },
};

export default User;
