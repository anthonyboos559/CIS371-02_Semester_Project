const express = require('express');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('text/html')) {
    return res.redirect('/');
  }
  next();
});

app.use(require('./routes/users'));
app.use(require('./routes/stats'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
