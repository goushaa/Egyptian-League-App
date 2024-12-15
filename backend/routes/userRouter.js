const express = require('express');
const requireAuth = require('../middlewares/requireAuth.js');
const userController = require("../controllers/userController.js");

const userRouter = express.Router();

// Require authentication for all user routes
userRouter.use(requireAuth);

userRouter.patch("/", userController.editUser);
userRouter.get("/unauthorized", userController.unauthorizedUsers);
userRouter.get("/:id", userController.getUser);
userRouter.delete("/:id", userController.deleteUser);
userRouter.patch("/approve/:id", userController.approveUser);
userRouter.get("/", userController.getAllUsers);

module.exports = userRouter;
