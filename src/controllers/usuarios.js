import { Usuario } from '../models/index.js';
import bcrypt from 'bcrypt';

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'direccion', 'telefono'],
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

export const getUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'direccion', 'telefono'],
    });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

export const createUsuario = async (req, res) => {
  const { nombre, email, contraseña, rol = 'cliente' } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const usuario = await Usuario.create({
      nombre,
      email,
      contraseña: hashedPassword,
      rol,
      direccion,
      telefono,
    });
    res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      direccion: usuario.direccion,
      telefono: usuario.telefono,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, contraseña } = req.body;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (email) updates.email = email;
    if (contraseña) updates.contraseña = await bcrypt.hash(contraseña, 10);

    await usuario.update(updates);
    res.json({ message: 'Usuario actualizado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: err.message });
  }
};