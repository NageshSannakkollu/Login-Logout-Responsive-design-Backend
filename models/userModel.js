const bcrypt = require("bcryptjs");
const db = require("../db");

const User = {
  create: (name, email, password) => {
    // bcrypt.hashSync is synchronous (use hash if you need async, but better-sqlite3 is synchronous)
    const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log("hashedPassword:",hashedPassword)
    try {
      const stmt = db.prepare("INSERT INTO user (name, email, password) VALUES (?, ?,?)");
      // console.log("stmt:",stmt)
      const result = stmt.run(name,email, hashedPassword);
      // console.log("result:",result)
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

  updateById: (id, data) => {
    const { email,password } = data;
    const stmt = db.prepare(`
      UPDATE user 
      SET email = ?, password = ?
      WHERE id = ?
    `);
    const result = stmt.run(email, password, id);
    if (result.changes > 0) {
      const stmt = db.prepare("SELECT * FROM user WHERE id = ?");
      const user = stmt.get(id); // returns user object or undefined
      return user;
    }
    return null;
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