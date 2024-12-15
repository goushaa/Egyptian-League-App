const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');

const matchRouter = express.Router();
const matchController = require('../controllers/matchController.js');

// Define routes with authentication middleware for POST and PUT
matchRouter.post('/', requireAuth, matchController.createMatch);
matchRouter.put('/:matchId', requireAuth, matchController.editMatch);
matchRouter.get('/:matchId', matchController.viewMatch);
matchRouter.get('/', matchController.viewMatches);

module.exports = matchRouter;
