const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "users.db");

// Open DB (synchronous)
let db;
try {
    db = new Database(dbPath);
    console.log("DB Connected Successfully!");
} catch (err) {
    console.log(`DB Connection Error: ${err.message}`);
}

const createUserTable = `
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`;

try {
    db.exec(createUserTable);
    console.log("User table created");
} catch (err) {
    console.log(`Table Creation Error: ${err.message}`);
}

module.exports = db;