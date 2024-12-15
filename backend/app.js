const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
// Enable CORS for all routes
app.use(cors());

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,PATCH,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

module.exports = app;
