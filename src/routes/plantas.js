import express from 'express';
import { getPlantas, getPlanta, createPlanta, updatePlanta, deletePlanta } from '../controllers/plantas.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlantas);
router.get('/:id', getPlanta);
router.post('/', verifyToken, isAdmin, createPlanta);
router.put('/:id', verifyToken, isAdmin, updatePlanta);
router.delete('/:id', verifyToken, isAdmin, deletePlanta);

export default router;