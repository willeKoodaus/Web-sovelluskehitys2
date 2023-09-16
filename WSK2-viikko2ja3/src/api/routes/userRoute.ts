import express from 'express';
import {userPost} from '../controllers/userController';
import {body} from 'express-validator';

const router = express.Router();

router
  .route('/')
  .post(
    body('username').isLength({min: 2}).isString().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({min: 5}).isString().escape(),
    userPost
  );

export default router;
