import { Planta } from '../models/index.js';

export const getPlantas = async (req, res) => {
  try {
    const plantas = await Planta.findAll();
    res.json(plantas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener plantas', error: err.message });
  }
};

export const getPlanta = async (req, res) => {
  const { id } = req.params;
  try {
    const planta = await Planta.findByPk(id);
    if (!planta) {
      return res.status(404).json({ message: 'Planta no encontrada' });
    }
    res.json(planta);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener planta', error: err.message });
  }
};

export const createPlanta = async (req, res) => {
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  try {
    const planta = await Planta.create({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen,
    });
    res.status(201).json(planta);
    console.log("Planta creada:", planta);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear planta', error: err.message });
  }
};

export const updatePlanta = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;
  try {
    const planta = await Planta.findByPk(id);
    if (!planta) {
      return res.status(404).json({ message: 'Planta no encontrada' });
    }
    await planta.update({ nombre, descripcion, precio, stock, categoria, imagen });
    res.json({ message: 'Planta actualizada' });
    console.log("Planta actualizada:", planta);
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar planta', error: err.message });
  }
};

export const deletePlanta = async (req, res) => {
  const { id } = req.params;
  try {
    const planta = await Planta.findByPk(id);
    if (!planta) {
      return res.status(404).json({ message: 'Planta no encontrada' });
    }
    await planta.destroy();
    res.json({ message: 'Planta eliminada' });
    console.log("Planta eliminada:", planta);
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar planta', error: err.message });
  }
};