const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');

const stadiumRouter = express.Router();
const stadiumController = require('../controllers/stadiumController.js');

// Define routes
stadiumRouter.post('/',requireAuth, stadiumController.createStadium);
stadiumRouter.get('/', stadiumController.getStadiums);

module.exports = stadiumRouter;
