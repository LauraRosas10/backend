import { auth } from "../config/firebase.js";
import { Usuario } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Login con Google
export const loginGoogle = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    let usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      usuario = await Usuario.create({
        nombre: name || email.split("@")[0],
        email,
        contraseña: null,
        rol: "cliente",
        firebaseuid: uid,
      });
    } else if (!usuario.firebaseuid) {
      await usuario.update({ firebaseuid: uid, rol: "cliente" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: usuario.id, nombre: usuario.nombre, email, rol: usuario.rol },
    });
  } catch (err) {
    res
      .status(401)
      .json({ message: "Token de Firebase inválido", error: err.message });
  }
};

// Login con base de datos
export const loginDB = async (req, res) => {
  
  const { email, contraseña } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.contraseña) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: usuario.id, nombre: usuario.nombre, email, rol: usuario.rol },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: err.message });
  }
};

// Registro en base de datos
export const registerDB = async (req, res) => {
  const { nombre, email, contraseña, rol } = req.body;
  try {
    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol, // Fijar cliente en producción
    });
        // ----> AÑADE ESTA LÍNEA PARA DIAGNÓSTICO <----
    console.log('Valor de JWT_SECRET ANTES de jwt.sign:', process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: { id: usuario.id, nombre, email, rol: usuario.rol },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al registrarse", error: err.message });
  }
};
