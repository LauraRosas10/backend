// src/db_setup/init_db.js
import mysql from 'mysql2/promise';

// 1. Importa sequelize (default), serverDbConfig Y dbName (nombrados) desde config/db.js
import sequelizeConfig, { serverDbConfig } from '../config/db.js';
//   He renombrado 'sequelize' a 'sequelizeConfig' para claridad, es la instancia de tu archivo de configuración.

// 2. Importa la función de sincronización y los modelos necesarios para el seeder desde models/index.js
//    Asumimos que models/index.js exporta 'syncDatabase' y los modelos.
import { syncDatabase } from '../models/index.js';
//    No necesitas 'sequelize as sequelizeInstance' si usas 'sequelizeConfig' consistentemente
//    o si 'syncDatabase' ya usa la instancia correcta internamente.

// 3. Importa tu función de seeding
import { seedData } from './botanicdb.js'; 

// La variable 'dbName' importada de config/db.js se usará globalmente en este módulo.

const createDatabaseIfNotExists = async () => {
    // No necesitas 'const dbName = ...' aquí, ya que 'dbName' se importa.
    const  dbName = "botanic_panic_db"; // Asegúrate de que 'dbName' esté definido en serverDbConfig
    let connection;
    try {
        console.log('Intentando crear/asegurar la base de datos:', dbName); // Usa la dbName importada
        connection = await mysql.createConnection(serverDbConfig); // Usa serverDbConfig importado
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`); // Usa dbName importada
        console.log(`Base de datos '${dbName}' asegurada/creada.`);
    } catch (error) {
        console.error(`Error creando la base de datos '${dbName}':`, error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('Error: No se pudo conectar a MySQL. ¿Está XAMPP (MySQL) en ejecución?');
        }
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

export const initializeDatabase = async () => {
    const  dbName = "botanic_panic_db";
    try {
        console.log('Iniciando configuración de la base de datos...');

        // Paso 1: Crear la base de datos si no existe
        await createDatabaseIfNotExists();

        // Paso 2: Autenticar la conexión de Sequelize
        // Usa la instancia de sequelize de tu archivo de configuración.
        await sequelizeConfig.authenticate();
        console.log(`Conexión a la base de datos '${dbName}' (Sequelize) establecida exitosamente.`);

        // Paso 3: Sincronizar modelos (crear/actualizar tablas)
        // Llama a la función 'syncDatabase' importada de models/index.js
        console.log('Sincronizando modelos con la base de datos...');
        const syncOptions = process.env.NODE_ENV === 'development' ? { alter: true } : { force: false };
        await syncDatabase(syncOptions); // <--- LLAMADA A LA FUNCIÓN DE SINCRONIZACIÓN
        // El log de "Modelos sincronizados..." ya debería estar dentro de tu función syncDatabase.

        // Paso 4: Sembrar datos iniciales
        // seedData usará los modelos (Usuario, Planta, etc.) importados.
        await seedData();
        // El log de "Datos iniciales..." ya debería estar dentro de tu función seedData.

        console.log('¡Inicialización de la base de datos completada exitosamente!');
        return sequelizeConfig; // Devuelve la instancia principal de sequelize
    } catch (error) {
        console.error('Falló la inicialización de la base de datos:', error);
        process.exit(1);
    }
};