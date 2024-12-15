const express = require('express');

const teamRouter = express.Router();

const teamController = require('../controllers/teamController.js');

// Use RESTful conventions for route naming
teamRouter.get('/', teamController.getTeams);
teamRouter.get('/:id/logo', teamController.getTeamLogo);

module.exports = teamRouter;
