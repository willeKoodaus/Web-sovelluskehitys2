import express from 'express';

import {param, body} from 'express-validator';

import {
  speciesDelete,
  speciesGet,
  speciesListGet,
  speciesPost,
  speciesPut,
} from '../controllers/speciesController';

const router = express.Router();

router
  .route('/')
  .get(speciesListGet)
  .post(
    body('species_name').optional().isString().escape(),
    body('category').isMongoId().optional(),
    body('location').optional().isObject(),
    speciesPost
  );

router
  .route('/:id')
  .get(param('id').isMongoId(), speciesGet)
  .put(
    param('id').isMongoId(),
    body('species_name').notEmpty().isString().escape(),
    body('category').isMongoId(),
    body('image').notEmpty().isString().escape(),
    body('location').notEmpty().isObject(),
    speciesPut
  )
  .delete(param('id').isMongoId(), speciesDelete);

export default router;
