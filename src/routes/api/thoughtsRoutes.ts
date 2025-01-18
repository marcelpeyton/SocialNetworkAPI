import { Router } from 'express';
const router = Router();

import { getThoughts, getSingleThought, createThought, updateThought, deleteThought, addReaction, removeReaction } from '../../controllers/thoughtsController.js';


router.route('/').get(getThoughts).post(createThought);


router
  .route('/:thoughtsId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);


router.route('/:thoughtsId/reactions').post(addReaction);

router.route('/:thoughtsId/reactions/:reactionId').delete(removeReaction);

export default router;
