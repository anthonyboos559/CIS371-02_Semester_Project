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
    db.run(`
        CREATE TABLE IF NOT EXISTS data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          chartData TEXT NOT NULL,
          total TEXT NOT NULL,
          filter TEXT NOT NULL,
          title TEXT NOT NULL
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

function saveChart(username, chartData, total, filter, title) {
    return new Promise((resolve, reject) => {
      const chartDataStr = JSON.stringify(chartData);
      db.run(
        `INSERT INTO data (username, chartData, total, filter, title) VALUES (?, ?, ?, ?, ?)`,
        [username, chartDataStr, total, filter, title],
        function (err) {
          if (err) {
            return reject(err);
          } 
          resolve();
        }
      );
    });
}

function getCharts(username) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, chartData, total, filter, title FROM data WHERE username = ?`,
        [username],
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          const formatted = rows.map(row => ({
            id: row.id,
            chartData: JSON.parse(row.chartData),
            total: row.total,
            filter: row.filter,
            title: row.title,
          }));
          resolve(formatted);
        }
      );
    });
  }

module.exports = { db, createUser, getUser, saveChart, getCharts };