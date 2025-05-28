// src/db_setup/seeders.js
import { Usuario, Planta, Pedido ,DetallePedido } from '../models/index.js'; // Asegúrate de importar tus modelos
// Importa otros modelos que necesites para el seeding

export const seedData = async () => {
    try {
        console.log('Iniciando proceso de seeding...');

        // Usuarios
        const usuariosCount = await Usuario.count();
        if (usuariosCount === 0) {
            await Usuario.bulkCreate([
                { nombre: 'Botanic Panic', email: 'botanicpanic@gmail.com', contraseña: '$2b$10$9Ff2Xk62Rtz81erNhmfQD.aXF6mZ4hmlM0EJkQgNEg4J8SJaaLUHu', rol: 'admin', direccion: null, telefono: null },
                { nombre: 'Laura Rosas', email: 'lalavanesarosas@gmail.com', contraseña: '$2b$10$qP6wMyLgRCvj15QGfj7RR.S3qhbqtpcubs5nWqZ4eI3BBGGslt4DO', rol: 'cliente', direccion: null, telefono: null },
                { nombre: 'Alejandro', email: 'alejandro@gmail.com', contraseña: '$2b$10$IGV4muzY2hsWI2RIFbctgOSwfd6WIULKcvFLoONKPNO5kIBrSMEWe', rol: 'admin', direccion: null, telefono: null },
                { nombre: 'Gabriel Vera', email: 'gabriel@gmail.com', contraseña: '$2b$10$cpahaxj2wCxhlIUwYcGOZuxya/rTjR6/P.gv2h0toHVtslpsYlJ/e', rol: 'admin', direccion: null, telefono: null },
                { nombre: 'Pedro', email: 'pedro@gmail.com', contraseña: '$2b$10$iCa73wgxbC.yEU9JaWXNXeYEHOK1svPqWCikHkejX23B/cNGThvEG', rol: 'cliente', direccion: null, telefono: null },
                { nombre: 'Yesid', email: 'yesid@gmail.com', contraseña: '$2b$10$zZUj.bb357D1d38YwpFF7edyRdZfCmOtSqAQEfzwBNJaDjp6gL4My', rol: 'admin', direccion: null, telefono: null }

            ]);
            console.log('Datos iniciales para Usuarios insertados.');
        } else {
            console.log('Tabla Usuarios ya contiene datos, seeding omitido.');
        }

        //  Plantas
        const plantasCount = await Planta.count();
        if (plantasCount === 0) {
            await Planta.bulkCreate([
                {
                    "id": 1,
                    "nombre": "Monstera Deliciosa",
                    "descripcion": "Planta de interior popular por sus hojas grandes y fenestradas. Fácil cuidado, luz indirecta.",
                    "precio": 25.99,
                    "stock": 15,
                    "categoria": "interior",
                    "imagen": "https://cdn.pixabay.com/photo/2016/04/08/13/52/daffodils-1316128_1280.jpg"
                },
                {
                    "id": 2,
                    "nombre": "Pothos Dorado",
                    "descripcion": "Resistente planta colgante con hojas variegadas en tonos verdes y amarillos. Ideal para principiantes.",
                    "precio": 12.50,
                    "stock": 30,
                    "categoria": "interior",
                    "imagen": "https://cdn.pixabay.com/photo/2015/06/23/13/56/plants-in-pots-818718_1280.jpg"
                },
                {
                    "id": 3,
                    "nombre": "Sansevieria Zeylanica",
                    "descripcion": "Conocida como Lengua de Suegra. Muy resistente, purifica el aire. Requiere poca agua.",
                    "precio": 18.00,
                    "stock": 22,
                    "categoria": "interior",
                    "imagen": "https://cdn.pixabay.com/photo/2017/01/22/19/21/house-plant-2000617_1280.jpg"
                },
                {
                    "id": 4,
                    "nombre": "Ficus Lyrata Bambino",
                    "descripcion": "Versión compacta del popular Ficus Pandurata, con hojas grandes en forma de lira. Luz brillante indirecta.",
                    "precio": 35.75,
                    "stock": 10,
                    "categoria": "interior",
                    "imagen": "https://media.istockphoto.com/id/1401702743/es/foto/ilustraci%C3%B3n-3d-de-plantas-de-interior-en-maceta-aisladas-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=Df_Y9t9SKMwYJEjJcN6Ef-gSfRjrc5TBaRHoZAHyIq8="
                },
                {
                    "id": 5,
                    "nombre": "Lavanda Angustifolia",
                    "descripcion": "Planta aromática con flores moradas. Atrae polinizadores. Pleno sol y buen drenaje.",
                    "precio": 9.99,
                    "stock": 40,
                    "categoria": "exterior",
                    "imagen": "https://media.istockphoto.com/id/2109107105/es/foto/iris-reticulata-alida.jpg?s=612x612&w=0&k=20&c=f9wsJBbVV4V1an45aCr7ZfxLB4nvLtygcl871sF1UMA="
                },
                {
                    "id": 6,
                    "nombre": "Rosal Miniatura Rojo",
                    "descripcion": "Rosal compacto ideal para macetas o borduras. Flores rojas vibrantes. Requiere sol directo.",
                    "precio": 15.20,
                    "stock": 18,
                    "categoria": "exterior",
                    "imagen": "https://media.istockphoto.com/id/1308512991/es/foto/rosa-rosa-en-una-olla-macetas-herramientas-de-jard%C3%ADn-sobre-el-fondo.jpg?s=612x612&w=0&k=20&c=kIlRp2i1vz_PG7FLGPbr90ylk8-IgeMt1Sqwz3dsr0g="
                },
                {
                    "id": 7,
                    "nombre": "Helecho Espada",
                    "descripcion": "Helecho robusto y elegante, ideal para zonas sombreadas y húmedas del jardín.",
                    "precio": 20.00,
                    "stock": 12,
                    "categoria": "exterior",
                    "imagen": "https://media.istockphoto.com/id/1378834016/es/foto/mini-helechos-arborescentes-en-londres-inglaterra.jpg?s=612x612&w=0&k=20&c=QkMy_JW833XsIzSvXeZD8yxgEuZ-GUF7Yk9U_FPsSHY="
                },
                {
                    "id": 8,
                    "nombre": "Geranio Zonal Rosa",
                    "descripcion": "Clásico geranio con flores en tonos rosados. Resistente y florífero. Pleno sol.",
                    "precio": 7.50,
                    "stock": 50,
                    "categoria": "exterior",
                    "imagen": "https://media.istockphoto.com/id/599751224/es/foto/flores-rojas-de-geranio-de-jard%C3%ADn-en-maceta.jpg?s=612x612&w=0&k=20&c=sx3oKglR2ejiasbUq7BSBuY-rC6pYmODkbFSmwbkBmU="
                },
                {
                    "id": 9,
                    "nombre": "Regadera Metálica Vintage",
                    "descripcion": "Regadera de zinc con capacidad de 5 litros, diseño clásico y funcional.",
                    "precio": 29.95,
                    "stock": 25,
                    "categoria": "accesorio",
                    "imagen": "https://media.istockphoto.com/id/1367890204/es/foto/jardiner%C3%ADa-en-el-patio-trasero.jpg?s=612x612&w=0&k=20&c=jPmNNR1SIIhM-k8vrnixpSP0m-5sfAn2qFMEfSp0w_w="
                },
                {
                    "id": 10,
                    "nombre": "Maceta de Barro Grande",
                    "descripcion": "Maceta de terracota de 30cm, ideal para plantas medianas. Clásico diseño natural.",
                    "precio": 14.99,
                    "stock": 35,
                    "categoria": "accesorio",
                    "imagen": "https://media.istockphoto.com/id/1163739474/es/foto/seto-de-recorte-de-jardinero-en-el-jard%C3%ADn.jpg?s=612x612&w=0&k=20&c=Y4QMmFnIF6VjRT7ie3oJFiefGxf37FLEgd__32vkBwY="
                },
                {
                    "id": 11,
                    "nombre": "Sustrato Universal 10L",
                    "descripcion": "Tierra preparada para plantas de interior y exterior. Con perlita y compost.",
                    "precio": 8.90,
                    "stock": 80,
                    "categoria": "accesorio",
                    "imagen": "https://media.istockphoto.com/id/91742062/es/foto/fertilizante-%C3%A1rboles.jpg?s=612x612&w=0&k=20&c=64Zw-ha-PJsO2JqFJ8ikXx4HZWTso263oJWcYojrzGs="
                },
                {
                    "id": 12,
                    "nombre": "Kit de Herramientas para Jardín",
                    "descripcion": "Set de 5 piezas: pala, rastrillo, guantes, pulverizador y tijeras.",
                    "precio": 22.30,
                    "stock": 20,
                    "categoria": "accesorio",
                    "imagen": "https://tumatera.co/cdn/shop/products/7709572247310_13_700x700.jpg?v=1715809074"
                },
                {
                    "id": 13,
                    "nombre": "Atomizador Manual 500ml",
                    "descripcion": "Pulverizador para riego o aplicación de productos. Boquilla ajustable.",
                    "precio": 5.75,
                    "stock": 60,
                    "categoria": "accesorio",
                    "imagen": "https://image.made-in-china.com/2f0j00iVtzaZwRaWkh/Manual-Garden-Sprayer-High-Pressure-Hand-Watering-Pump-Water-Garden-Sprayer.jpg"
                },
                {
                    "id": 14,
                    "nombre": "Ficus Elástica Robusta",
                    "descripcion": "Planta de interior con hojas verdes brillantes. Requiere luz indirecta.",
                    "precio": 28.40,
                    "stock": 16,
                    "categoria": "interior",
                    "imagen": "https://mygarden.com.co/wp-content/uploads/2020/05/PLANTA-FICUS-ELASTICA-ROBUSTA-1-.jpg"
                },
                {
                    "id": 15,
                    "nombre": "Cactus Mix en Macetas",
                    "descripcion": "Set de 3 cactus pequeños en macetas de cerámica. Ideal para decoración.",
                    "precio": 18.90,
                    "stock": 45,
                    "categoria": "interior",
                    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM4LRzw1elG8gdG2n6wxdyHsABm2AOH1YZdw&s"
                },
                {
                    "id": 16,
                    "nombre": "Palma Areca",
                    "descripcion": "Planta tropical que purifica el aire. Requiere humedad y luz media.",
                    "precio": 32.99,
                    "stock": 9,
                    "categoria": "interior",
                    "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRF__pdnwMzayvFfxAaCdTej_3mGGotQXPGA&s"
                },
                {
                    "id": 17,
                    "nombre": "Aloe Vera",
                    "descripcion": "Suculenta medicinal, ideal para interior o exterior. Luz abundante.",
                    "precio": 10.50,
                    "stock": 38,
                    "categoria": "interior",
                    "imagen": "https://mundojardin.eu/wp-content/uploads/2020/12/Aloe-barbadensis-931x1024.jpg"
                },
                {
                    "id": 18,
                    "nombre": "Ruda Aromática",
                    "descripcion": "Planta de jardín con propiedades medicinales. Necesita sol directo.",
                    "precio": 6.75,
                    "stock": 28,
                    "categoria": "exterior",
                    "imagen": "https://mekero.cl/cdn/shop/files/ru3-min_900x.png?v=1745555491"
                },
                {
                    "id": 19,
                    "nombre": "Crásula Ovata (Jade)",
                    "descripcion": "Suculenta de fácil mantenimiento. Atrae buena suerte según el feng shui.",
                    "precio": 11.90,
                    "stock": 26,
                    "categoria": "interior",
                    "imagen": "https://lagreentouch.es/cdn/shop/articles/entretien-crassula-ovata-326518.jpg?v=1718903884&width=1600"
                },
                {
                    "id": 20,
                    "nombre": "Fertilizante Líquido Orgánico",
                    "descripcion": "Fertilizante natural para estimular el crecimiento. Apto para todo tipo de plantas.",
                    "precio": 13.25,
                    "stock": 42,
                    "categoria": "fertilizante",
                    "imagen": "https://http2.mlstatic.com/D_NQ_NP_750095-MCO81099024939_122024-O.webp"
                },
                                {
                    "id": 21,
                    "nombre": "Maceta de barro",
                    "descripcion": "Maceta de barro artesanal.",
                    "precio": 13.25,
                    "stock": 42,
                    "categoria": "macetas",
                    "imagen": "https://d22fxaf9t8d39k.cloudfront.net/820b5929366e1cb4560d4f45d7d9ea7e66a04f7d98693d1eecd6d032b43dc1db54932.jpeg"
                },
            ]);
            console.log('Datos iniciales para Plantas insertados.');
        } else {
            console.log('Tabla Plantas ya contiene datos, seeding omitido.');
        }

        // Agrega más lógica de seeding para otras tablas (Pedidos, Categorias, etc.)
        // const pedidosCount = await Pedido.count();
        // if (pedidosCount === 0) {
        //     // ... crear pedidos de ejemplo, asegurándote que los IDs de usuario y planta existan
        // }

        console.log('Proceso de seeding completado.');
    } catch (error) {
        console.error('Error durante el seeding:', error);
        throw error; // Propagar el error para que el inicio de la app falle si el seeding es crítico
    }


    //pedido

            const pedidosCount = await Pedido.count();
        if (pedidosCount === 0) {
            await Pedido.bulkCreate([
                {
                    "id": 1,
                    "id_usuario": 2,
                    "fecha": "2025-05-08 19:48:04",
                    "estado": "pendiente",
                    "total": 25.99
                },
                {
                    "id": 2,
                    "id_usuario": 5,
                    "fecha": "2025-05-14 19:48:04",
                    "estado": "pendiente",
                    "total": 20.00
                }
            ]);
            console.log('Datos iniciales para pedidos insertados.');
        } else {
            console.log('Tabla Pedidos ya contiene datos, seeding omitido.');
        }



    //detalle_pedido

        const detalle_pedido = await DetallePedido.count();
        if (detalle_pedido === 0) {
            await DetallePedido.bulkCreate([
                {
                    "id": 1,
                    "id_pedido": 2,
                    "id_planta": 1,
                    "cantidad": 1,
                    "precio_unitario": 25.99
                },
                {
                    "id": 2,
                    "id_pedido": 2,
                    "id_planta": 7,
                    "cantidad": 1,
                    "precio_unitario": 20.00
                },

            ]);
            console.log('Datos iniciales para detalles pedido insertados.');
        } else {
            console.log('Tabla Detalles pedido ya contiene datos, seeding omitido.');
        }
};