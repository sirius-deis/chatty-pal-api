const express = require('express');

const userController = require('../controllers/user.controllers');
const { isEmail, isNotEmptyWithLength } = require('../utils/validator');
const { isLoggedIn } = require('../middlewares/auth.middlewares');

const userRouter = express.Router();

userRouter.post(
    '/signup',
    isEmail(),
    isNotEmptyWithLength('password'),
    isNotEmptyWithLength('passwordConfirm'),
    userController.signup
);

userRouter.post(
    '/login',
    isEmail(),
    isNotEmptyWithLength('password'),
    userController.login
);

userRouter.post(
    '/delete',
    isLoggedIn,
    isNotEmptyWithLength('password'),
    userController.delete
);

module.exports = userRouter;
