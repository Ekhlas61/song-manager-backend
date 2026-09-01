import { Router } from 'express';
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  getStatistics,
} from '../controllers/songController';

const router = Router();

router.route('/').get(getSongs).post(createSong);
router.route('/stats').get(getStatistics);
router.route('/:id').get(getSongById).put(updateSong).delete(deleteSong);

export default router;