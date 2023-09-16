import express from 'express';
import {
  categoryDelete,
  //categoryDelete,
  categoryGet,
  categoryListGet,
  categoryPost,
  categoryPut,
  // categoryPut,
} from '../controllers/categoryController';
import {param, body} from 'express-validator';
import {authenticate} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(categoryListGet)
  .post(body('category_name').notEmpty().isString().escape(), categoryPost);

router
  .route('/:id')
  .get(param('id').isMongoId(), categoryGet)
  .put(
    param('id').isMongoId(),
    body('category_name').notEmpty().isString().escape(),
    categoryPut
  )
  .delete(authenticate, param('id').isMongoId(), categoryDelete);

export default router;
