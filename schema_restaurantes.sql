-- =====================================================
-- SCHEMA PARA RESTAURANTES, PLATILLOS Y BEBIDAS
-- =====================================================

-- Tabla: restaurantes
CREATE TABLE restaurantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  color_tema VARCHAR(7) DEFAULT '#ff6b6b', -- Color para el carrusel
  emoji VARCHAR(10), -- Emoji representativo (🌮, 🍕, etc.)
  calificacion DECIMAL(2,1) DEFAULT 0.0,
  tiempo_entrega_min INTEGER DEFAULT 30, -- minutos
  costo_envio DECIMAL(10,2) DEFAULT 0.00,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: categorias (para organizar platillos y bebidas)
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(50) NOT NULL UNIQUE, -- 'Comidas', 'Bebidas', 'Postres', etc.
  emoji VARCHAR(10),
  color_gradiente_inicio VARCHAR(7),
  color_gradiente_fin VARCHAR(7),
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: platillos
CREATE TABLE platillos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id UUID NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  precio DECIMAL(10,2) NOT NULL,
  descuento_porcentaje INTEGER DEFAULT 0,
  disponible BOOLEAN DEFAULT TRUE,
  tiempo_preparacion INTEGER DEFAULT 15, -- minutos
  calorias INTEGER,
  es_vegetariano BOOLEAN DEFAULT FALSE,
  es_picante BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: bebidas
CREATE TABLE bebidas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurante_id UUID NOT NULL REFERENCES restaurantes(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen_url TEXT,
  precio DECIMAL(10,2) NOT NULL,
  descuento_porcentaje INTEGER DEFAULT 0,
  disponible BOOLEAN DEFAULT TRUE,
  tamano VARCHAR(20), -- 'Chica', 'Mediana', 'Grande', 'Litro'
  temperatura VARCHAR(20), -- 'Fría', 'Caliente', 'Natural'
  con_alcohol BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_platillos_restaurante ON platillos(restaurante_id);
CREATE INDEX idx_platillos_categoria ON platillos(categoria_id);
CREATE INDEX idx_bebidas_restaurante ON bebidas(restaurante_id);
CREATE INDEX idx_bebidas_categoria ON bebidas(categoria_id);
CREATE INDEX idx_restaurantes_activo ON restaurantes(activo);

-- =====================================================
-- DATOS DE EJEMPLO
-- =====================================================

-- Insertar categorías
INSERT INTO categorias (nombre, emoji, color_gradiente_inicio, color_gradiente_fin, orden) VALUES
('Comidas', '🍽️', '#f093fb', '#f5576c', 1),
('Bebidas', '🥤', '#667eea', '#764ba2', 2),
('Postres', '🍰', '#fa709a', '#fee140', 3),
('Mandaditos', '🛒', '#4facfe', '#00f2fe', 4);

-- Insertar restaurantes de ejemplo
INSERT INTO restaurantes (nombre, descripcion, imagen_url, color_tema, emoji, calificacion, tiempo_entrega_min, costo_envio) VALUES
('Tacos El Güero', 'Los mejores tacos de la ciudad con recetas tradicionales', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', '#ff6b6b', '🌮', 4.8, 25, 15.00),
('Pizza House', 'Pizza artesanal al horno de leña', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', '#4ecdc4', '🍕', 4.6, 35, 20.00),
('Burger King Premium', 'Hamburguesas gourmet con ingredientes frescos', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', '#ffe66d', '🍔', 4.7, 30, 18.00),
('Sushi Master', 'Sushi fresco preparado por chefs expertos', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', '#95e1d3', '🍱', 4.9, 40, 25.00),
('Café & Co', 'Café de especialidad y bebidas artesanales', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', '#a0785a', '☕', 4.5, 20, 10.00);

-- Obtener IDs de restaurantes para las inserciones
DO $$
DECLARE
  tacos_id UUID;
  pizza_id UUID;
  burger_id UUID;
  sushi_id UUID;
  cafe_id UUID;
  comidas_cat UUID;
  bebidas_cat UUID;
BEGIN
  -- Obtener IDs
  SELECT id INTO tacos_id FROM restaurantes WHERE nombre = 'Tacos El Güero';
  SELECT id INTO pizza_id FROM restaurantes WHERE nombre = 'Pizza House';
  SELECT id INTO burger_id FROM restaurantes WHERE nombre = 'Burger King Premium';
  SELECT id INTO sushi_id FROM restaurantes WHERE nombre = 'Sushi Master';
  SELECT id INTO cafe_id FROM restaurantes WHERE nombre = 'Café & Co';
  SELECT id INTO comidas_cat FROM categorias WHERE nombre = 'Comidas';
  SELECT id INTO bebidas_cat FROM categorias WHERE nombre = 'Bebidas';

  -- Platillos de Tacos El Güero
  INSERT INTO platillos (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, disponible, es_picante) VALUES
  (tacos_id, comidas_cat, 'Tacos de Pastor', '3 tacos de pastor con piña, cilantro y cebolla', 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300', 65.00, TRUE, TRUE),
  (tacos_id, comidas_cat, 'Tacos de Asada', '3 tacos de arrachera con guacamole', 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=300', 70.00, TRUE, FALSE),
  (tacos_id, comidas_cat, 'Orden de Quesadillas', 'Quesadillas de queso oaxaca con carne al gusto', 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=300', 85.00, TRUE, FALSE);

  -- Platillos de Pizza House
  INSERT INTO platillos (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, disponible) VALUES
  (pizza_id, comidas_cat, 'Pizza Margarita', 'Salsa de tomate, mozzarella y albahaca fresca', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', 150.00, TRUE),
  (pizza_id, comidas_cat, 'Pizza Pepperoni', 'Pepperoni premium y queso mozzarella', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', 165.00, TRUE),
  (pizza_id, comidas_cat, 'Pizza Hawaiana', 'Jamón, piña y queso', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300', 155.00, TRUE);

  -- Platillos de Burger King Premium
  INSERT INTO platillos (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, disponible) VALUES
  (burger_id, comidas_cat, 'Burger Clásica', 'Carne angus, lechuga, tomate, cebolla y salsa especial', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300', 120.00, TRUE),
  (burger_id, comidas_cat, 'Burger BBQ Bacon', 'Doble carne, tocino, queso cheddar y salsa BBQ', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300', 145.00, TRUE),
  (burger_id, comidas_cat, 'Burger Vegetariana', 'Hamburguesa de lentejas con aguacate', 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=300', 110.00, TRUE);

  -- Platillos de Sushi Master
  INSERT INTO platillos (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, disponible) VALUES
  (sushi_id, comidas_cat, 'Rollo California', '10 piezas - Cangrejo, aguacate y pepino', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300', 135.00, TRUE),
  (sushi_id, comidas_cat, 'Rollo Philadelphia', '10 piezas - Salmón, queso crema y pepino', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300', 150.00, TRUE),
  (sushi_id, comidas_cat, 'Sashimi Mixto', '12 piezas - Salmón, atún y pez mantequilla', 'https://images.unsplash.com/photo-1564489563957-7cfe7e3d55ae?w=300', 185.00, TRUE);

  -- Bebidas de Tacos El Güero
  INSERT INTO bebidas (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, tamano, temperatura) VALUES
  (tacos_id, bebidas_cat, 'Agua de Horchata', 'Agua fresca de horchata natural', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300', 25.00, 'Mediana', 'Fría'),
  (tacos_id, bebidas_cat, 'Agua de Jamaica', 'Agua fresca de jamaica natural', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300', 25.00, 'Mediana', 'Fría'),
  (tacos_id, bebidas_cat, 'Refresco', 'Coca-Cola, Sprite, Fanta', 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300', 20.00, 'Chica', 'Fría');

  -- Bebidas de Pizza House
  INSERT INTO bebidas (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, tamano, temperatura) VALUES
  (pizza_id, bebidas_cat, 'Limonada Mineral', 'Limonada natural con agua mineral', 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f0d?w=300', 35.00, 'Grande', 'Fría'),
  (pizza_id, bebidas_cat, 'Cerveza Artesanal', 'Cerveza artesanal local', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300', 55.00, 'Mediana', 'Fría'),
  (pizza_id, bebidas_cat, 'Té Helado', 'Té negro con limón', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', 30.00, 'Grande', 'Fría');

  -- Bebidas de Café & Co
  INSERT INTO bebidas (restaurante_id, categoria_id, nombre, descripcion, imagen_url, precio, tamano, temperatura) VALUES
  (cafe_id, bebidas_cat, 'Café Americano', 'Café de especialidad', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300', 40.00, 'Mediana', 'Caliente'),
  (cafe_id, bebidas_cat, 'Cappuccino', 'Espresso con leche vaporizada', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300', 50.00, 'Mediana', 'Caliente'),
  (cafe_id, bebidas_cat, 'Frappé de Caramelo', 'Café frío con caramelo y crema', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300', 65.00, 'Grande', 'Fría');
END $$;

-- =====================================================
-- FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_restaurantes_updated_at BEFORE UPDATE ON restaurantes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platillos_updated_at BEFORE UPDATE ON platillos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bebidas_updated_at BEFORE UPDATE ON bebidas
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
