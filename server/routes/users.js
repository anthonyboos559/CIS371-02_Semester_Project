const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const { createUser, getUser, saveChart, getCharts } = require('../database/db');

router.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ error: 'Missing Username or Password!'})
  }

  try {
      const user = await createUser(username, password);
      res.cookie('username', username, {maxAge: 3600000});
      return res.json({ success: true, user: user.username });
  }
  catch (err) {
      if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'That Username already exists!' });
      }
      return res.status(500).json({ error: "The server encountered an error!" });
  }
});

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
      return res.status(400).json({ error: 'Missing Username or Password!'})
  }

  try {
      const user = await getUser(username);
      if (!user || user.password !== password) {
          return res.status(401).json({ error: 'Invalid login!' });
      }
      res.cookie('username', username, {maxAge: 3600000});
      return res.json({ ok: true, user: user.username});
  }
  catch (err) {
      return res.status(500).json({ error: "The server encountered an error!" });
  }
});

router.post('/api/saveChart', (req, res) => {
    const { username, chartData, total, filter, title } = req.body;
  
    saveChart(username, chartData, total, filter, title)
      .then(result => res.json({ success: true }))
      .catch(err => {
        console.error('Error saving chart:', err);
        res.status(500).json({ error: 'Failed to save chart' });
    });
});
  
router.get('/api/charts/:username', (req, res) => {
    const { username } = req.params;

    getCharts(username)
        .then(charts => res.json({ charts }))
        .catch(err => {
        console.error('Error loading charts:', err);
        res.status(500).json({ error: 'Failed to load charts' });
    });
});

module.exports = router;
