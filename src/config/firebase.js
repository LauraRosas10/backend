
// src/config/firebase.js
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let serviceAccount;
const serviceAccountPath = path.resolve(process.cwd(), 'src', 'config', 'firebase-adminsdk.json'); // O la ruta que sea correcta
// console.log('Intentando cargar la cuenta de servicio desde:', serviceAccountPath); // Para depurar

try {
  const rawData = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(rawData);
} catch (error) {
  console.error('Error al cargar el archivo de cuenta de servicio de Firebase:', error);
  console.error(`Asegúrate de que el archivo exista en: ${serviceAccountPath} y sea un JSON válido.`);
  console.error('La aplicación podría no funcionar correctamente sin la inicialización de Firebase Admin.');
  // Podrías decidir salir del proceso si Firebase es crítico: process.exit(1);
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin SDK inicializado correctamente.');
} else {
  console.error('Firebase Admin SDK NO PUDO SER INICIALIZADO debido a un error con la cuenta de servicio.');
}

export const auth = serviceAccount ? admin.auth() : null; // Exporta null si falló la inicialización