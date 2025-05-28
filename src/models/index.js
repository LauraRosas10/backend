import sequelize from '../config/db.js';
import Usuario from './usuario.js';
import Planta from './planta.js';
import Pedido from './pedido.js';
import DetallePedido from './detalle_pedido.js';

// Relaciones

Usuario.hasMany(Pedido, { foreignKey: 'id_usuario' });
Pedido.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido' });

Planta.hasMany(DetallePedido, { foreignKey: 'id_planta' });
DetallePedido.belongsTo(Planta, { foreignKey: 'id_planta' });

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // force: true elimina y recrea tablas (úsalo con cuidado)
    console.log('Base de datos sincronizada');
  } catch (err) {
    console.error('Error al sincronizar la base de datos:', err);
  }
};


export {syncDatabase, sequelize, Usuario, Planta, Pedido, DetallePedido };