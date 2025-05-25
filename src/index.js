// --- Importaciones de Módulos ---
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // Para logging HTTP
import dotenv from 'dotenv';
import multer from 'multer';     // Para manejar la subida de archivos.
import path from 'path';       // Módulo de Node.js para trabajar con rutas de archivos y directorios.
import fs from 'fs';           // Módulo de Node.js para interactuar con el sistema de archivos (file system).
import { fileURLToPath } from 'url'; // Para obtener __dirname en módulos ES

// Cargar variables de entorno
// En src/index.js
// ... (tus importaciones, incluyendo path y fileURLToPath) ...
// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename); // Si index.js está en src/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Cargar variables de entorno especificando la ruta
// Asumimos que .env está en la raíz del proyecto (un nivel arriba de src/)
// y que este archivo (index.js) está en src/
// Si index.js está en la raíz, la ruta sería solo '.env'
const envPath = path.resolve(__dirname, '../.env'); // Si index.js está en src/
// const envPath = path.resolve(__dirname, '.env'); // Si index.js está en la raíz del proyecto

console.log(`DEBUG: Intentando cargar .env desde: ${envPath}`); // Para verificar la ruta
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
  console.error('DEBUG: Error al cargar .env:', dotenvResult.error);
} else if (Object.keys(dotenvResult.parsed).length === 0) {
  console.warn('DEBUG: .env cargado pero está vacío o no contiene variables parseables.');
} else {
  console.log('DEBUG: .env cargado exitosamente. Variables:', Object.keys(dotenvResult.parsed));
}
// Verifica si JWT_SECRET está ahora en process.env
console.log('DEBUG: JWT_SECRET después de dotenv.config explícito:', process.env.JWT_SECRET);
// ... resto de tu archivo src/index.js



// --- Configuración Inicial Express ---
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json()); // Para parsear application/json

// --- Importar la instancia de sequelize Y la función de sincronización ---
// Asumiendo que este archivo (app.js) está en la RAÍZ del proyecto
import { sequelize, syncDatabase } from './models/index.js';

// --- Importar tus routers de API existentes ---
import authRoutes from './routes/auth.js';
import pedidosRoutes from './routes/pedidos.js';
import plantasRoutes from './routes/plantas.js';
import usuariosRoutes from './routes/usuarios.js';



app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/plantas', plantasRoutes);
app.use('/api/usuarios', usuariosRoutes);


// --- Configuración de Directorio de Subidas (UPLOADS) ---
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// --- Lógica de Creación de Directorio UPLOADS (si no existe) ---
if (!fs.existsSync(UPLOADS_DIR)) {
    try {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log(`Directorio de subidas creado exitosamente en: ${UPLOADS_DIR}`);
    } catch (err) {
        console.error(`Error al crear el directorio de subidas: ${err.message}`);
    }
} else {
    console.log(`Directorio de subidas ya existe en: ${UPLOADS_DIR}`);
}

// --- Middlewares Globales de Express ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

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
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', // Tipos de imagen comunes
        'video/mp4', 'video/mpeg', // Tipos de video comunes
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido: ' + file.mimetype), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: fileFilter
}).array('files', 10);



// rutas para gestor de  archivos

app.post('/upload', (req, res) => {
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
            url: `/uploads/${file.filename}` // URL relativa para acceder al archivo
        }));
        res.status(200).json({ message: 'Archivos subidos exitosamente!', files: uploadedFilesDetails });
    });
});

app.get('/files', (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) {
            console.error("Error al leer el directorio de subidas:", err);
            return res.status(500).json({ message: 'Error al obtener la lista de archivos del servidor.' });
        }
        const visibleFiles = files
            .filter(file => !file.startsWith('.'))
            .map(file => ({
                name: file,
                url: `/uploads/${file}` // URL relativa
            }));
        res.status(200).json(visibleFiles);
    });
});


app.get('/download/:filename', (req, res) => {


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
                return res.status(500).json({ message: 'Error al descargar el archivo.' });
            }
        });
    });
});

app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(UPLOADS_DIR, filename);

    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ message: 'Nombre de archivo inválido para eliminación.' });
    }

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Intento de eliminar archivo no encontrado: ${filePath}`, err);
            return res.status(404).json({ message: 'Archivo no encontrado en el servidor, no se puede eliminar.' });
        }
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error al eliminar el archivo ${filePath}:`, unlinkErr);
                return res.status(500).json({ message: 'Error interno del servidor al intentar eliminar el archivo.' });
            }
            console.log(`Archivo eliminado exitosamente: ${filePath}`);
            res.status(200).json({ message: `Archivo '${filename}' eliminado exitosamente.` });
        });
    });
});


    app.get('/api', (req, res) => {
    res.send('¡API de Botanic Panic funcionando!');
    });

    // --- Manejador de Errores Global ---
    app.use((err, req, res, next) => { // El 'next' es importante aquí aunque no se use explícitamente
    console.error("Error no manejado:", err.stack || err.message || err);
    res.status(err.status || 500).json({
        message: err.message || '¡Algo salió mal en el servidor!',
        // error: process.env.NODE_ENV === 'development' ? err : {} // Opcional: solo mostrar stack en desarrollo
    });
    });

    // --- Función para Iniciar el Servidor y Sincronizar la BD ---
    async function startApp() {
    try {
        console.log('Intentando conectar y sincronizar la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión a la base de datos MySQL establecida exitosamente.');
        await syncDatabase(); // Llama a la función de src/models/index.js
        app.listen(PORT, () => {
        console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
        console.log(`Los archivos subidos se guardarán en: ${UPLOADS_DIR}`);
        console.log(`Y estarán disponibles en: http://localhost:${PORT}/uploads/`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor o sincronizar la base de datos:', error);
        process.exit(1);
    }
    }

// Iniciar la aplicación
startApp();