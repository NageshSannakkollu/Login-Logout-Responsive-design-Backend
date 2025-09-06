const bcrypt = require("bcryptjs");
const db = require("../db");

const User = {
  create: (email, password) => {
    // bcrypt.hashSync is synchronous (use hash if you need async, but better-sqlite3 is synchronous)
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const stmt = db.prepare("INSERT INTO user (email, password) VALUES (?, ?)");
      const result = stmt.run(email, hashedPassword);
      return { id: result.lastInsertRowid };
    } catch (err) {
      throw err;
    }
  },

  getByEmail: (email) => {
    try {
      const stmt = db.prepare("SELECT * FROM user WHERE email = ?");
      const user = stmt.get(email); // returns user object or undefined
      return user;
    } catch (err) {
      throw err;
    }
  },

  getAll: () => {
    const stmt = db.prepare("SELECT * FROM user");
    return stmt.all(); // returns all users as an array
  },

  deleteById: (id) => {
    try {
      const stmt = db.prepare("DELETE FROM user WHERE id = ?");
      const result = stmt.run(id);
      return result.changes > 0; // true if a row was deleted
    } catch (err) {
      throw err;
    }
  }
};

module.exports = User;