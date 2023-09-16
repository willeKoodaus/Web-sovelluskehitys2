import express from 'express';
import {param, body} from 'express-validator';

import {
  animalDelete,
  animalGet,
  animalListGet,
  animalPost,
  animalPut,
} from '../controllers/animalController';

const router = express.Router();

router
  .route('/')
  .get(animalListGet)
  .post(
    body('animal_name').notEmpty().isString().escape(),
    body('birthdate').isDate(),
    body('species').isMongoId(),
    body('gender').notEmpty().isString().escape(),
    animalPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId(), animalGet)
  .put(
    param('id').isMongoId(),
    body('animal_name').isString().escape().optional(),
    body('birthdate').isDate().optional(),
    body('species').isMongoId().optional(),
    body('gender').isString().escape().optional(),
    animalPut
  )
  .delete(param('id').isMongoId(), animalDelete);

export default router;
