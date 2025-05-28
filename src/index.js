
// --- Importaciones de Módulos ---
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// --- Importar tus routers ---
import authRoutes from './routes/auth.js';
import pedidosRoutes from './routes/pedidos.js';
import plantasRoutes from './routes/plantas.js';
import usuariosRoutes from './routes/usuarios.js';

// --- Importar lógica de inicialización de la BD ---
import { initializeDatabase } from './base_datos/init.js'; // NUEVA IMPORTACIÓN
// sequelize ya no se importa directamente aquí, vendrá de initializeDatabase o config/db.js si lo necesitas en otro lado
// import { sequelize } from './models/index.js'; // Ya no es necesario importar sequelize directamente aquí para iniciar.


// --- Configuración de __dirname y carga de .env ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la raíz del proyecto (un nivel arriba de src/)
const envPath = path.resolve(__dirname, '../.env');
console.log(`DEBUG: Intentando cargar .env desde: ${envPath}`);
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
    console.error('DEBUG: Error al cargar .env:', dotenvResult.error);
} else {
    console.log('DEBUG: .env cargado exitosamente.');
}
console.log('DEBUG: JWT_SECRET después de dotenv.config:', process.env.JWT_SECRET); // Verifica tus variables





// --- Configuración Inicial Express ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// --- Configuración de Directorio de Subidas (UPLOADS) ---
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads'); // Ajustado para estar en la raíz/public/uploads
if (!fs.existsSync(UPLOADS_DIR)) {
    try {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log(`Directorio de subidas creado: ${UPLOADS_DIR}`);
    } catch (err) {
        console.error(`Error al crear directorio de subidas: ${err.message}`);
    }
} else {
    console.log(`Directorio de subidas ya existe: ${UPLOADS_DIR}`);
}
// Servir archivos estáticos desde la carpeta 'public' (que contendrá 'uploads')
app.use(express.static(path.join(__dirname, '..', 'public')));


// --- Configuración de Multer ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E6);
        const originalNameCleaned = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, uniquePrefix + '-' + originalNameCleaned);
    }
});
const fileFilter = (req, file, cb) => {
    // ... (tu fileFilter) ...
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/mpeg',
        'application/pdf', 'text/plain',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido: ' + file.mimetype), false);
    }
};
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter }).array('files', 10);


// --- Rutas ---
// Rutas de tu API
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/plantas', plantasRoutes);
app.use('/api/usuarios', usuariosRoutes);


// Rutas de Multer para gestión de archivos
app.post('/upload', (req, res) => { /* ... tu lógica de upload ... */ 
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Error de Multer: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ message: `Error al subir: ${err.message}` });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No se seleccionaron archivos válidos o no pasaron el filtro.' });
        }
        const uploadedFilesDetails = req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`
        }));
        res.status(200).json({ message: 'Archivos subidos exitosamente!', files: uploadedFilesDetails });
    });
});
app.get('/files', (req, res) => { /* ... tu lógica de /files ... */ 
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) {
            console.error("Error al leer el directorio de subidas:", err);
            return res.status(500).json({ message: 'Error al obtener la lista de archivos del servidor.' });
        }
        const visibleFiles = files
            .filter(file => !file.startsWith('.'))
            .map(file => ({
                name: file,
                url: `/uploads/${file}`
            }));
        res.status(200).json(visibleFiles);
    });
});
app.get('/download/:filename', (req, res) => { /* ... tu lógica de /download ... */
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);  
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ message: 'Nombre de archivo inválido.' });
    }
    fs.access(filePath, fs.constants.F_OK, (err) => {   
        if (err) {
            return res.status(404).json({ message: 'Archivo no encontrado.' });
        }
        res.download(filePath, filename, (downloadErr) => {
            if (downloadErr) {
                console.error("Error al descargar el archivo:", downloadErr);
                // Evita enviar otra respuesta si ya se envió una (aunque res.download maneja headers)
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Error al descargar el archivo.' });
                }
            }
        });
    });
 });
app.delete('/delete/:filename', (req, res) => { /* ... tu lógica de /delete ... */
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ message: 'Nombre de archivo inválido para eliminación.' });
    }
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ message: 'Archivo no encontrado.' });
        }
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                return res.status(500).json({ message: 'Error al eliminar el archivo.' });
            }
            res.status(200).json({ message: `Archivo '${filename}' eliminado.` });
        });
    });
 });

app.get('/api', (req, res) => {
    res.send('¡API de Botanic Panic funcionando correctamente!');
});

// --- Manejador de Errores Global ---
app.use((err, req, res, next) => {
    console.error("Error no manejado:", err.stack || err.message || err);
    res.status(err.status || 500).json({
        message: err.message || '¡Algo salió mal en el servidor!',
        // error: process.env.NODE_ENV === 'development' ? err : {} // Opcional
    });
});

// --- Función para Iniciar el Servidor ---
async function startApp() {
    try {
        // 1. Inicializar la base de datos (crear BD, sincronizar tablas, sembrar datos)
        await initializeDatabase(); // Aquí se maneja toda la lógica de BD

        // 2. Inicializar Firebase Admin SDK (si no se ha hecho ya)
        // (Tu lógica de inicialización de Firebase ya está en src/config/firebase.js y se ejecuta al importar)
        // Solo asegúrate de que se importe antes de necesitar `admin.auth()`
        // import './config/firebase.js'; // Si no se importa en otro lado
        // O si exportas 'auth' desde firebase.js y lo usas, ya se habrá ejecutado.

        app.listen(PORT, () => {
            console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
            console.log(`Los archivos subidos se guardarán en: ${UPLOADS_DIR}`);
            console.log(`Y estarán disponibles en: http://localhost:${PORT}/uploads/`);
        });
    } catch (error) {
        console.error('No se pudo iniciar la aplicación:', error);
        process.exit(1);
    }
}

// Iniciar la aplicación
startApp();