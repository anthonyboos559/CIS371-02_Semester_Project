const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
  path.resolve(__dirname, 'stats.db'),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
        console.log('DB error:', err.message);
    } 
    else {
        console.log('Connected to SQLite DB');
    }
  }
);

db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
  }
);

function createUser(username, password) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password],
            (err) => {
                if (err) {
                    return reject(err);
                }
                resolve({ user: username });
            }
        );
    });
}

function getUser(username, callback) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            }
        );
    });
}

module.exports = { db, createUser, getUser };