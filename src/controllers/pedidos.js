// Importamos la instancia de Sequelize desde  db.js
import sequelize from '../config/db.js';
import { QueryTypes } from 'sequelize'; // Necesario para algunos tipos de queries

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await sequelize.query('SELECT * FROM pedidos', {
      type: QueryTypes.SELECT, // Indicar que es una query de selección
    });
    res.json(pedidos);
  } catch (err) {
    console.error("Error en getPedidos:", err);
    res.status(500).json({ message: 'Error al obtener pedidos', error: err.message });
  }
};

export const getPedido = async (req, res) => {
  const { id } = req.params;
  try {
    // Usamos 'replacements' para pasar parámetros de forma segura
    const pedido = await sequelize.query(
      'SELECT * FROM pedidos WHERE id = :id',
      {
        replacements: { id: id },
        type: QueryTypes.SELECT,
      }
    );

    if (pedido.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const detalles = await sequelize.query(
      'SELECT * FROM detalles_pedido WHERE id_pedido = :id_pedido',
      {
        replacements: { id_pedido: id },
        type: QueryTypes.SELECT,
      }
    );
    // sequelize.query con SELECT devuelve un array, incluso si es un solo resultado.
    res.json({ ...pedido[0], detalles: detalles });
  } catch (err) {
    console.error("Error en getPedido:", err);
    res.status(500).json({ message: 'Error al obtener pedido', error: err.message });
  }
};

export const createPedido = async (req, res) => {
  const { id_usuario, items, estado = 'pendiente' } = req.body; // items: [{ id_planta, cantidad }]

  if (!id_usuario || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Datos de pedido inválidos. Se requiere id_usuario e items.' });
  }

  // Para usar transacciones con sequelize.query(), el proceso es un poco diferente
  // pero crucial para la integridad de los datos.
  const t = await sequelize.transaction(); // Iniciar una transacción de Sequelize

  try {
    // Validar stock
    for (const item of items) {
      if (!item.id_planta || !item.cantidad || item.cantidad <= 0) {
        await t.rollback();
        return res.status(400).json({ message: `Item inválido en el pedido: ${JSON.stringify(item)}.` });
      }
      const plantas = await sequelize.query(
        'SELECT stock, nombre FROM plantas WHERE id = :id_planta',
        {
          replacements: { id_planta: item.id_planta },
          type: QueryTypes.SELECT,
          transaction: t, // Pasar la transacción a la query
        }
      );
      if (plantas.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: `Planta con ID ${item.id_planta} no encontrada.` });
      }
      const planta = plantas[0];
      if (planta.stock < item.cantidad) {
        await t.rollback();
        return res.status(400).json({ message: `Stock insuficiente para ${planta.nombre} (ID: ${item.id_planta}). Solicitado: ${item.cantidad}, Disponible: ${planta.stock}` });
      }
    }

    // Calcular total
    let total = 0;
    for (const item of items) {
      const [planta] = await sequelize.query(
        'SELECT precio FROM plantas WHERE id = :id_planta',
        {
          replacements: { id_planta: item.id_planta },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );
      total += parseFloat(planta.precio) * parseInt(item.cantidad, 10);
    }

    // Crear pedido
    // Para INSERT con sequelize.query, devuelve [results, metadata]
    // metadata.insertId contiene el ID para MySQL.
    const [pedidoResult, metadataPedido] = await sequelize.query(
      'INSERT INTO pedidos (id_usuario, total, estado) VALUES (:id_usuario, :total, :estado)',
      {
        replacements: { id_usuario, total, estado },
        type: QueryTypes.INSERT, // Indicar que es INSERT
        transaction: t,
      }
    );
    const pedidoId = metadataPedido; // En MySQL, insertId está directamente en metadata para INSERT.

    // Crear detalles y actualizar stock
    for (const item of items) {
      const [planta] = await sequelize.query(
        'SELECT precio FROM plantas WHERE id = :id_planta',
        {
          replacements: { id_planta: item.id_planta },
          type: QueryTypes.SELECT,
          transaction: t,
        }
      );
      await sequelize.query(
        'INSERT INTO detalles_pedido (id_pedido, id_planta, cantidad, precio_unitario) VALUES (:id_pedido, :id_planta, :cantidad, :precio_unitario)',
        {
          replacements: {
            id_pedido: pedidoId,
            id_planta: item.id_planta,
            cantidad: item.cantidad,
            precio_unitario: planta.precio,
          },
          type: QueryTypes.INSERT,
          transaction: t,
        }
      );
      await sequelize.query(
        'UPDATE plantas SET stock = stock - :cantidad WHERE id = :id_planta',
        {
          replacements: { cantidad: item.cantidad, id_planta: item.id_planta },
          type: QueryTypes.UPDATE, // Indicar que es UPDATE
          transaction: t,
        }
      );
    }

    await t.commit(); // Confirmar la transacción

    // Para devolver el pedido completo, hacemos un SELECT
    const [pedidoCreado] = await sequelize.query(
        'SELECT * FROM pedidos WHERE id = :id',
        { replacements: { id: pedidoId }, type: QueryTypes.SELECT }
    );
    const detallesCreados = await sequelize.query(
        'SELECT * FROM detalles_pedido WHERE id_pedido = :id_pedido',
        { replacements: { id_pedido: pedidoId }, type: QueryTypes.SELECT }
    );

    res.status(201).json({ ...pedidoCreado, detalles: detallesCreados });

  } catch (err) {
    if (t && !t.finished) await t.rollback(); // Revertir si algo falla y la transacción no ha terminado
    console.error("Error en createPedido:", err);
    res.status(500).json({ message: 'Error al crear pedido', error: err.message, stack: err.stack });
  }
};

export const updatePedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    if (!estado) {
        return res.status(400).json({ message: "El campo 'estado' es requerido para la actualización." });
    }
    // sequelize.query para UPDATE devuelve [results, metadata]
    // metadata.affectedRows o metadata.changedRows es útil
    const [results, metadata] = await sequelize.query(
      'UPDATE pedidos SET estado = :estado WHERE id = :id',
      {
        replacements: { estado, id },
        type: QueryTypes.UPDATE,
      }
    );

    if (metadata.affectedRows === 0) { // O changedRows dependiendo de la necesidad
      return res.status(404).json({ message: 'Pedido no encontrado o sin cambios necesarios.' });
    }

    // Para devolver el pedido actualizado, hacemos un SELECT
    const [pedidoActualizado] = await sequelize.query('SELECT * FROM pedidos WHERE id = :id', {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    res.json(pedidoActualizado);

  } catch (err) {
    console.error("Error en updatePedido:", err);
    res.status(500).json({ message: 'Error al actualizar pedido', error: err.message });
  }
};

export const deletePedido = async (req, res) => {
  const { id } = req.params;
  try {
    // Considerar ON DELETE CASCADE en la base de datos para detalles_pedido
    // o eliminarlos explícitamente primero si es necesario
    // await sequelize.query('DELETE FROM detalles_pedido WHERE id_pedido = :id',
    //    { replacements: { id }, type: QueryTypes.DELETE });

    const [results, metadata] = await sequelize.query(
      'DELETE FROM pedidos WHERE id = :id',
      {
        replacements: { id },
        type: QueryTypes.DELETE,
      }
    );

    if (metadata.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json({ message: 'Pedido eliminado exitosamente' });
  } catch (err) {
    console.error("Error en deletePedido:", err);
    res.status(500).json({ message: 'Error al eliminar pedido', error: err.message });
  }
};