-- Plantas de Interior
INSERT INTO plantas (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Monstera Deliciosa', 'Planta de interior popular por sus hojas grandes y fenestradas. Fácil cuidado, luz indirecta.', 25.99, 15, 'interior', 'https://picsum.photos/seed/monstera1/400/300'),
('Pothos Dorado', 'Resistente planta colgante con hojas variegadas en tonos verdes y amarillos. Ideal para principiantes.', 12.50, 30, 'interior', 'https://picsum.photos/seed/pothos1/400/300'),
('Sansevieria Zeylanica', 'Conocida como Lengua de Suegra. Muy resistente, purifica el aire. Requiere poca agua.', 18.00, 22, 'interior', 'https://picsum.photos/seed/sansevieria1/400/300'),
('Ficus Lyrata Bambino', 'Versión compacta del popular Ficus Pandurata, con hojas grandes en forma de lira. Luz brillante indirecta.', 35.75, 10, 'interior', 'https://picsum.photos/seed/ficuslyrata1/400/300');

-- Plantas de Exterior
INSERT INTO plantas (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Lavanda Angustifolia', 'Planta aromática con flores moradas. Atrae polinizadores. Pleno sol y buen drenaje.', 9.99, 40, 'exterior', 'https://picsum.photos/seed/lavanda1/400/300'),
('Rosal Miniatura Rojo', 'Rosal compacto ideal para macetas o borduras. Flores rojas vibrantes. Requiere sol directo.', 15.20, 18, 'exterior', 'https://picsum.photos/seed/rosalrojo1/400/300'),
('Helecho Espada', 'Helecho robusto y elegante, ideal para zonas sombreadas y húmedas del jardín.', 22.00, 12, 'exterior', 'https://picsum.photos/seed/helecho1/400/300'),
('Geranio Zonal Rosa', 'Clásico geranio con flores en tonos rosados. Resistente y florífero. Pleno sol.', 7.50, 50, 'exterior', 'https://picsum.photos/seed/geranio1/400/300');

-- Accesorios
INSERT INTO plantas (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Regadera Metálica Vintage', 'Regadera de zinc con capacidad de 5 litros, diseño clásico y funcional.', 29.95, 25, 'accesorio', 'https://picsum.photos/seed/regadera1/400/300'),
('Tijeras de Podar Bypass', 'Tijeras de mano para poda precisa de ramas pequeñas y flores. Acero inoxidable.', 16.80, 35, 'accesorio', 'https://picsum.photos/seed/tijeraspodar1/400/300'),
('Pulverizador de Agua 500ml', 'Botella pulverizadora para aumentar la humedad ambiental de las plantas o aplicar tratamientos.', 6.25, 60, 'accesorio', 'https://picsum.photos/seed/pulverizador1/400/300'),
('Guantes de Jardinería Reforzados', 'Guantes de cuero sintético con refuerzo en palma y dedos para protección.', 12.00, 45, 'accesorio', 'https://picsum.photos/seed/guantesjardin1/400/300');

-- Macetas
INSERT INTO plantas (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Maceta de Terracota Clásica 20cm', 'Maceta de barro cocido tradicional, porosa, ideal para buen drenaje. Diámetro 20cm.', 8.50, 70, 'maceta', 'https://picsum.photos/seed/macetaterracota1/400/300'),
('Maceta Colgante de Cerámica Blanca', 'Elegante maceta colgante de cerámica esmaltada en blanco, con cuerdas de yute.', 22.90, 28, 'maceta', 'https://picsum.photos/seed/macetacolgante1/400/300'),
('Maceta Autorriego Pequeña', 'Maceta de plástico con sistema de autorriego, ideal para plantas que requieren humedad constante. 15cm.', 14.75, 33, 'maceta', 'https://picsum.photos/seed/macetaautorriego1/400/300'),
('Jardinera de Madera Tratada 60cm', 'Jardinera rectangular de madera de pino tratada para exterior. 60x20x20cm.', 38.00, 15, 'maceta', 'https://picsum.photos/seed/jardineramadera1/400/300');

-- Fertilizantes
INSERT INTO plantas (nombre, descripcion, precio, stock, categoria, imagen) VALUES
('Fertilizante Orgánico Universal 1Kg', 'Abono orgánico completo para todo tipo de plantas, en formato granulado.', 10.99, 55, 'fertilizante', 'https://picsum.photos/seed/fertilizanteorganico1/400/300'),
('Humus de Lombriz Líquido 500ml', 'Fertilizante líquido concentrado a base de humus de lombriz, rico en nutrientes.', 13.50, 40, 'fertilizante', 'https://picsum.photos/seed/humuslombriz1/400/300'),
('Fertilizante para Floración NPK Alto en PK', 'Fertilizante específico para potenciar la floración en plantas ornamentales. 750gr.', 17.25, 30, 'fertilizante', 'https://picsum.photos/seed/fertilizantefloracion1/400/300'),
('Sustrato para Suculentas y Cactus 5L', 'Mezcla especial de sustrato con excelente drenaje para suculentas y cactus.', 9.00, 65, 'fertilizante', 'https://picsum.photos/seed/sustratosuculentas1/400/300');


-- Usuario Admin Específico
INSERT INTO usuarios (nombre, email, contraseña, rol, direccion, telefono, firebaseuid) VALUES
('Admin Botanic Panic', 'botanicpanic@gmail.com', 'botanic123', 'admin', 'Calle Principal 123, Ciudad Admin', '5551112222', 'firebaseUIDAdmin001');

-- Usuario Cliente 
INSERT INTO usuarios (nombre, email, contraseña, rol, direccion, telefono, firebaseuid) VALUES
('Lala Vanesa Rosas', 'lalavanesarosas@gmail.com', 'laurarosas', 'cliente', 'Avenida Las Flores 45, Colonia Jardín', '5553334444', 'firebaseUIDCliente001');

-- Usuario Admin 
INSERT INTO usuarios (nombre, email, contraseña, rol, direccion, telefono, firebaseuid) VALUES
('Alejandro', 'alejandro@gmail.com', 'superAdminPass789', 'admin', 'Boulevard Central 789, Capital', '5555556666', 'firebaseUIDAdmin002');

-- Usuario Admin 
INSERT INTO usuarios (nombre, email, contraseña, rol, direccion, telefono, firebaseuid) VALUES
('Gabriel Vera', 'gabriel@gmail.com', 'Segura2024', 'admin', 'Plaza de la Tecnología 10, Distrito Tech', '5557778888', 'firebaseUIDAdmin003');

-- Usuario Cliente 
INSERT INTO usuarios (nombre, email, contraseña, rol, direccion, telefono, firebaseuid) VALUES
('Pedro Cliente Fiel', 'pedro@gmail.com', 'comprasOnline123', 'cliente', 'Calle Secundaria 67, Barrio Residencial', '5559990000', 'firebaseUIDCliente002');




-- Pedido 1 para Lala Vanesa Rosas
INSERT INTO pedidos (id_usuario, fecha, estado, total) VALUES
(2, '2024-05-10 10:30:00', 'Procesando', 55.94);

-- Pedido 2 para Pedro Cliente Fiel
INSERT INTO pedidos (id_usuario, fecha, estado, total) VALUES
(5, '2024-05-11 14:15:00', 'Enviado', 28.48);

-- Pedido 3 para Lala Vanesa Rosas
INSERT INTO pedidos (id_usuario, fecha, estado, total) VALUES
(2, '2024-05-12 09:00:00', 'Entregado', 48.49);



-- Detalles para Pedido 1 (id_pedido = 1)
-- 1 x Monstera Deliciosa (id_planta=1, precio=25.99)
-- 1 x Regadera Metálica Vintage (id_planta=9, precio=29.95)
INSERT INTO detalles_pedido (id_pedido, id_planta, cantidad, precio_unitario) VALUES
(1, 1, 1, 25.99),
(1, 9, 1, 29.95);

-- Detalles para Pedido 2 (id_pedido = 2)
-- 2 x Lavanda Angustifolia (id_planta=5, precio=9.99)
-- 1 x Maceta de Terracota Clásica 20cm (id_planta=13, precio=8.50)
INSERT INTO detalles_pedido (id_pedido, id_planta, cantidad, precio_unitario) VALUES
(2, 5, 2, 9.99),
(2, 13, 1, 8.50);

-- Detalles para Pedido 3 (id_pedido = 3)
-- 3 x Pothos Dorado (id_planta=2, precio=12.50)
-- 1 x Fertilizante Orgánico Universal 1Kg (id_planta=17, precio=10.99)
INSERT INTO detalles_pedido (id_pedido, id_planta, cantidad, precio_unitario) VALUES
(3, 2, 3, 12.50),
(3, 17, 1, 10.99);