import express from 'express';
import { loginDB, loginGoogle, registerDB } from '../controllers/auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js'; // tu conexión MySQL
import dotenv from 'dotenv';


dotenv.config();
const router = express.Router();

router.post('/login-google', loginGoogle);
router.post('/login-db', loginDB);
router.post('/register', registerDB);




router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});






export default router;
