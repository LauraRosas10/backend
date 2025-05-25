import express from 'express';
import { getPedidos, getPedido, createPedido, updatePedido, deletePedido } from '../controllers/pedidos.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getPedidos);
router.get('/:id', verifyToken, getPedido);
router.post('/', verifyToken, createPedido);
router.put('/:id', verifyToken, isAdmin, updatePedido);
router.delete('/:id', verifyToken, isAdmin, deletePedido);

export default router;