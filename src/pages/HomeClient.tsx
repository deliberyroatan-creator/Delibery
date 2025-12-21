import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Restaurante {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  color_tema: string;
  emoji: string;
  calificacion: number;
  tiempo_entrega_min: number;
  costo_envio: number;
}

interface Categoria {
  id: string;
  nombre: string;
  emoji: string;
  color_gradiente_inicio: string;
  color_gradiente_fin: string;
}

export default function HomeClient() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Cargar restaurantes y categorías desde Supabase
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar restaurantes
        const { data: restaurantesData, error: errorRestaurantes } = await supabase
          .from('restaurantes')
          .select('*')
          .eq('activo', true)
          .order('calificacion', { ascending: false })
          .limit(4);

        if (errorRestaurantes) {
          console.error('Error cargando restaurantes:', errorRestaurantes);
          console.error('Detalles:', errorRestaurantes.message);
          // Usar datos de respaldo si hay error
          setRestaurantes([
            { id: '1', nombre: 'Tacos El Güero', descripcion: 'Tacos tradicionales', imagen_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', color_tema: '#ff6b6b', emoji: '🌮', calificacion: 4.8, tiempo_entrega_min: 25, costo_envio: 15 },
            { id: '2', nombre: 'Pizza House', descripcion: 'Pizza artesanal', imagen_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', color_tema: '#4ecdc4', emoji: '🍕', calificacion: 4.6, tiempo_entrega_min: 35, costo_envio: 20 },
            { id: '3', nombre: 'Burger Premium', descripcion: 'Hamburguesas gourmet', imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', color_tema: '#ffe66d', emoji: '🍔', calificacion: 4.7, tiempo_entrega_min: 30, costo_envio: 18 },
            { id: '4', nombre: 'Sushi Master', descripcion: 'Sushi fresco', imagen_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', color_tema: '#95e1d3', emoji: '🍱', calificacion: 4.9, tiempo_entrega_min: 40, costo_envio: 25 }
          ]);
        } else {
          setRestaurantes(restaurantesData || []);
        }

        // Cargar categorías
        const { data: categoriasData, error: errorCategorias } = await supabase
          .from('categorias')
          .select('*')
          .order('orden', { ascending: true });

        if (errorCategorias) {
          console.error('Error cargando categorías:', errorCategorias);
          console.error('Detalles:', errorCategorias.message);
          // Usar datos de respaldo si hay error
          setCategorias([
            { id: '1', nombre: 'Comidas', emoji: '🍽️', color_gradiente_inicio: '#f093fb', color_gradiente_fin: '#f5576c' },
            { id: '2', nombre: 'Bebidas', emoji: '🥤', color_gradiente_inicio: '#667eea', color_gradiente_fin: '#764ba2' },
            { id: '3', nombre: 'Postres', emoji: '🍰', color_gradiente_inicio: '#fa709a', color_gradiente_fin: '#fee140' },
            { id: '4', nombre: 'Mandaditos', emoji: '🛒', color_gradiente_inicio: '#4facfe', color_gradiente_fin: '#00f2fe' }
          ]);
        } else {
          setCategorias(categoriasData || []);
        }
      } catch (error) {
        console.error('Error general:', error);
        // Datos de respaldo en caso de error de red
        setRestaurantes([
          { id: '1', nombre: 'Tacos El Güero', descripcion: 'Tacos tradicionales', imagen_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400', color_tema: '#ff6b6b', emoji: '🌮', calificacion: 4.8, tiempo_entrega_min: 25, costo_envio: 15 },
          { id: '2', nombre: 'Pizza House', descripcion: 'Pizza artesanal', imagen_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', color_tema: '#4ecdc4', emoji: '🍕', calificacion: 4.6, tiempo_entrega_min: 35, costo_envio: 20 },
          { id: '3', nombre: 'Burger Premium', descripcion: 'Hamburguesas gourmet', imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', color_tema: '#ffe66d', emoji: '🍔', calificacion: 4.7, tiempo_entrega_min: 30, costo_envio: 18 },
          { id: '4', nombre: 'Sushi Master', descripcion: 'Sushi fresco', imagen_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', color_tema: '#95e1d3', emoji: '🍱', calificacion: 4.9, tiempo_entrega_min: 40, costo_envio: 25 }
        ]);
        setCategorias([
          { id: '1', nombre: 'Comidas', emoji: '🍽️', color_gradiente_inicio: '#f093fb', color_gradiente_fin: '#f5576c' },
          { id: '2', nombre: 'Bebidas', emoji: '🥤', color_gradiente_inicio: '#667eea', color_gradiente_fin: '#764ba2' },
          { id: '3', nombre: 'Postres', emoji: '🍰', color_gradiente_inicio: '#fa709a', color_gradiente_fin: '#fee140' },
          { id: '4', nombre: 'Mandaditos', emoji: '🛒', color_gradiente_inicio: '#4facfe', color_gradiente_fin: '#00f2fe' }
        ]);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % restaurantes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + restaurantes.length) % restaurantes.length);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: '#ffffff', 
      minHeight: '100vh', 
      paddingBottom: '80px',
      position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#1e1b4b',
        padding: '14px 18px',
        boxShadow: '0 2px 16px rgba(30,27,75,0.4)',
        borderBottom: '2px solid rgba(168,85,247,0.3)',
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: '500px',
          margin: '0 auto',
        }}>
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="Delibery" 
            style={{ 
              height: '36px', 
              width: 'auto',
            }} 
          />

          {/* Menu Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(168,85,247,0.2)',
              border: '1px solid rgba(168,85,247,0.3)',
              borderRadius: '10px',
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168,85,247,0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
          >
            <div style={{ width: '22px', height: '2.5px', background: '#c084fc', borderRadius: '2px', transition: 'all 0.2s' }} />
            <div style={{ width: '22px', height: '2.5px', background: '#c084fc', borderRadius: '2px', transition: 'all 0.2s' }} />
            <div style={{ width: '22px', height: '2.5px', background: '#c084fc', borderRadius: '2px', transition: 'all 0.2s' }} />
          </button>
        </div>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 150,
              animation: 'fadeIn 0.2s ease',
            }}
          />
          
          {/* Menu */}
          <div style={{
            position: 'fixed',
            top: '72px',
            right: '20px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            padding: '8px',
            zIndex: 200,
            minWidth: '200px',
            animation: 'slideDown 0.3s ease',
          }}>
            <button
              onClick={() => { setMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#374151',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>👤</span>
              Mi Cuenta
            </button>
            
            <button
              onClick={() => { setMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#374151',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>📦</span>
              Mis Pedidos
            </button>
            
            <button
              onClick={() => { setMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#374151',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>💰</span>
              Mi Saldo
            </button>

            <div style={{ height: '1px', background: '#e5e7eb', margin: '8px 0' }} />
            
            <button
              onClick={() => { handleLogout(); setMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '15px',
                color: '#dc2626',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '20px' }}>🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main style={{ 
        maxWidth: '500px', 
        margin: '0 auto', 
        padding: '16px',
      }}>
        {/* Carrusel de Restaurantes */}
        <section style={{ marginBottom: '24px' }}>
          <div style={{ 
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '200px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}>
            {/* Slides */}
            {restaurantes.length > 0 ? restaurantes.map((restaurant, index) => (
              <div
                key={restaurant.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: currentSlide === index ? 1 : 0,
                  transform: currentSlide === index ? 'scale(1)' : 'scale(0.98)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  pointerEvents: currentSlide === index ? 'auto' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/restaurante/${restaurant.id}`)}
              >
                {/* Imagen de fondo con overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${restaurant.imagen_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.7)',
                }}/>
                
                {/* Gradient overlay para mejor legibilidad */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                }}/>

                {/* Contenido */}
                <div style={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                  zIndex: 2,
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    marginBottom: '8px',
                    alignSelf: 'flex-start',
                  }}>
                    <span style={{ 
                      color: '#fff', 
                      fontSize: '11px', 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {restaurant.emoji} Destacado
                    </span>
                  </div>
                  
                  <h3 style={{ 
                    color: '#fff', 
                    fontSize: '24px', 
                    fontWeight: 900,
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.5px',
                  }}>
                    {restaurant.nombre}
                  </h3>
                  
                  <p style={{ 
                    color: '#fff', 
                    fontSize: '13px', 
                    margin: 0,
                    opacity: 0.95,
                    fontWeight: 500,
                    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}>
                    ⭐ {restaurant.calificacion} • {restaurant.tiempo_entrega_min} min • ${restaurant.costo_envio} envío
                  </p>
                </div>
              </div>
            )) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontSize: '16px',
              }}>
                No hay restaurantes disponibles
              </div>
            )}

            {/* Navigation Arrows - Estilo moderno */}
            <button
              onClick={prevSlide}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#1e1b4b',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              ‹
            </button>

            <button
              onClick={nextSlide}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#1e1b4b',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              ›
            </button>

            {/* Dots - Estilo moderno */}
            <div style={{
              position: 'absolute',
              bottom: '14px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              padding: '6px 10px',
              borderRadius: '20px',
            }}>
              {restaurantes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: currentSlide === index ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: currentSlide === index ? '0 2px 8px rgba(255,255,255,0.3)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categorías / Platillos */}
        <section>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 800,
            color: '#111827',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '28px' }}>🍽️</span>
            ¿Qué se te antoja hoy?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
          }}>
            {categorias.length > 0 ? categorias.map((categoria) => (
              <div
                key={categoria.id}
                onClick={() => navigate(`/categoria/${categoria.id}`)}
                style={{
                  background: `linear-gradient(135deg, ${categoria.color_gradiente_inicio} 0%, ${categoria.color_gradiente_fin} 100%)`,
                  borderRadius: '16px',
                  padding: '20px 16px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 18px rgba(102,126,234,0.3)',
                  minHeight: '140px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102,126,234,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(102,126,234,0.3)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-15px',
                  fontSize: '90px',
                  opacity: 0.15,
                }}>
                  {categoria.emoji}
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{categoria.emoji}</div>
                  <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: 700, margin: '0 0 6px 0' }}>
                    {categoria.nombre}
                  </h3>
                </div>
              </div>
            )) : (
              <>
                {/* Fallback si no hay categorías */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  padding: '20px 16px',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  minHeight: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}>
                  Cargando...
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar with Curve */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
        {/* SVG Curve Background */}
        <svg 
          width="100%" 
          height="75" 
          viewBox="0 0 375 75" 
          preserveAspectRatio="none"
          style={{ 
            display: 'block',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <defs>
            <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
          <path 
            d="M 0 25 Q 93.75 0 187.5 0 Q 281.25 0 375 25 L 375 75 L 0 75 Z" 
            fill="url(#navGradient)"
            style={{ filter: 'drop-shadow(0 -4px 20px rgba(30,27,75,0.4))' }}
          />
        </svg>

        {/* Nav Items */}
        <div style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
          padding: '0 20px 12px 20px',
          height: '75px',
        }}>
          {/* Restaurantes */}
          <button style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '8px 16px',
            marginBottom: '8px',
          }}>
            <div style={{
              fontSize: '28px',
              transition: 'transform 0.2s',
            }}>
              🍽️
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '12px', 
              fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}>
              Restaurantes
            </span>
          </button>

          {/* Inicio (Elevated) */}
          <button style={{
            background: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(30,27,75,0.4)',
            marginBottom: '24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-4px',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              borderRadius: '50%',
              zIndex: -1,
            }} />
            <span style={{ fontSize: '32px' }}>🏠</span>
          </button>

          {/* Categorías */}
          <button style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '8px 16px',
            marginBottom: '8px',
          }}>
            <div style={{
              fontSize: '28px',
              transition: 'transform 0.2s',
            }}>
              📑
            </div>
            <span style={{ 
              color: '#fff', 
              fontSize: '12px', 
              fontWeight: 600,
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}>
              Categorías
            </span>
          </button>
        </div>
      </nav>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
