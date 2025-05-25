import express from 'express';
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarios.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, getUsuarios);
router.get('/:id', verifyToken, getUsuario);
router.post('/', createUsuario);
router.put('/:id', verifyToken, updateUsuario);
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);

export default router;