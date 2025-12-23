import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import BottomNav from "../components/BottomNav";
import RestaurantCarousel from "../components/RestaurantCarousel";
import PlatillosCarousel from "../components/PlatillosCarousel";

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

interface Platillo {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  precio?: number;
  disponible?: boolean;
  restaurante_id?: string;
  restaurante?: { id: string; nombre: string } | null;
}

export default function HomeClient() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [platillos, setPlatillos] = useState<Platillo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Array<any>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Cargar restaurantes y categorías desde Supabase
  useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar restaurantes
        const { data: restaurantesData, error: errorRestaurantes } =
          await supabase
            .from("restaurantes")
            .select("*")
            .eq("activo", true)
            .order("calificacion", { ascending: false })
            .limit(4);

        if (errorRestaurantes) {
          console.error("Error cargando restaurantes:", errorRestaurantes);
          console.error("Detalles:", errorRestaurantes.message);
          // Usar datos de respaldo si hay error
          setRestaurantes([]);
        } else {
          setRestaurantes(restaurantesData || []);
        }

        // Cargar categorías
        const { data: categoriasData, error: errorCategorias } = await supabase
          .from("categorias")
          .select("*")
          .order("orden", { ascending: true });

        if (errorCategorias) {
          console.error("Error cargando categorías:", errorCategorias);
          console.error("Detalles:", errorCategorias.message);
          // Usar datos de respaldo si hay error
          setCategorias([
            {
              id: "1",
              nombre: "Comidas",
              emoji: "🍽️",
              color_gradiente_inicio: "#f093fb",
              color_gradiente_fin: "#f5576c",
            },
            {
              id: "2",
              nombre: "Bebidas",
              emoji: "🥤",
              color_gradiente_inicio: "#667eea",
              color_gradiente_fin: "#764ba2",
            },
            {
              id: "3",
              nombre: "Postres",
              emoji: "🍰",
              color_gradiente_inicio: "#fa709a",
              color_gradiente_fin: "#fee140",
            },
            {
              id: "4",
              nombre: "Mandaditos",
              emoji: "🛒",
              color_gradiente_inicio: "#4facfe",
              color_gradiente_fin: "#00f2fe",
            },
          ]);
        } else {
          setCategorias(categoriasData || []);
        }
        // Cargar platillos (para sugerencias)
        const { data: platillosData, error: errorPlatillos } = await supabase
          .from("platillos")
          .select(
            `id,nombre,descripcion,imagen_url,precio,disponible,restaurante_id,restaurantes(id,nombre)`
          )
          .order("nombre", { ascending: true })
          .limit(100);

        if (errorPlatillos) {
          console.error("Error cargando platillos:", errorPlatillos);
          setPlatillos([]);
        } else {
          const mapped = (platillosData || []).map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            imagen_url: p.imagen_url,
            precio: p.precio,
            disponible: p.disponible,
            restaurante_id: p.restaurante_id,
            restaurante: p.restaurantes
              ? { id: p.restaurantes.id, nombre: p.restaurantes.nombre }
              : null,
          }));
          setPlatillos(mapped);
        }
      } catch (error) {
        console.error("Error general:", error);
        // Datos de respaldo en caso de error de red
        setRestaurantes([
          {
            id: "1",
            nombre: "Tacos El Güero",
            descripcion: "Tacos tradicionales",
            imagen_url:
              "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
            color_tema: "#ff6b6b",
            emoji: "🌮",
            calificacion: 4.8,
            tiempo_entrega_min: 25,
            costo_envio: 15,
          },
          {
            id: "2",
            nombre: "Pizza House",
            descripcion: "Pizza artesanal",
            imagen_url:
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
            color_tema: "#4ecdc4",
            emoji: "🍕",
            calificacion: 4.6,
            tiempo_entrega_min: 35,
            costo_envio: 20,
          },
          {
            id: "3",
            nombre: "Burger Premium",
            descripcion: "Hamburguesas gourmet",
            imagen_url:
              "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
            color_tema: "#ffe66d",
            emoji: "🍔",
            calificacion: 4.7,
            tiempo_entrega_min: 30,
            costo_envio: 18,
          },
          {
            id: "4",
            nombre: "Sushi Master",
            descripcion: "Sushi fresco",
            imagen_url:
              "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
            color_tema: "#95e1d3",
            emoji: "🍱",
            calificacion: 4.9,
            tiempo_entrega_min: 40,
            costo_envio: 25,
          },
        ]);
        setCategorias([
          {
            id: "1",
            nombre: "Comidas",
            emoji: "🍽️",
            color_gradiente_inicio: "#f093fb",
            color_gradiente_fin: "#f5576c",
          },
          {
            id: "2",
            nombre: "Bebidas",
            emoji: "🥤",
            color_gradiente_inicio: "#667eea",
            color_gradiente_fin: "#764ba2",
          },
          {
            id: "3",
            nombre: "Postres",
            emoji: "🍰",
            color_gradiente_inicio: "#fa709a",
            color_gradiente_fin: "#fee140",
          },
          {
            id: "4",
            nombre: "Mandaditos",
            emoji: "🛒",
            color_gradiente_inicio: "#4facfe",
            color_gradiente_fin: "#00f2fe",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  // Filtrar sugerencias cuando cambia la búsqueda
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const restMatches = restaurantes
      .filter((r) => `${r.nombre} ${r.descripcion}`.toLowerCase().includes(q))
      .slice(0, 4)
      .map((r) => ({
        type: "restaurante",
        id: r.id,
        nombre: r.nombre,
        descripcion: r.descripcion,
        emoji: r.emoji,
      }));

    const platMatches = platillos
      .filter((p) => `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q))
      .slice(0, 6 - restMatches.length)
      .map((p) => ({
        type: "platillo",
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        restaurante: p.restaurante,
      }));

    setSuggestions([...restMatches, ...platMatches]);
  }, [search, restaurantes, platillos]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
          <p style={{ color: "#6b7280", fontSize: "18px" }}>
            Cargando restaurantes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        paddingBottom: "80px",
        position: "relative",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#1e1b4b",
          padding: "14px 18px",
          boxShadow: "0 2px 16px rgba(30,27,75,0.4)",
          borderBottom: "2px solid rgba(168,85,247,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          {/* Logo / Título moderno */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                boxShadow: "0 6px 18px rgba(124,58,237,0.25)",
                fontSize: 16,
              }}
            >
              FD
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  background: "linear-gradient(90deg,#ffffff,#fde68a)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  textTransform: "capitalize",
                }}
              >
                food deliberi riatan
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>
                Tu comida, más cerca
              </div>
            </div>
          </div>

          {/* Menu Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(168,85,247,0.2)",
              border: "1px solid rgba(168,85,247,0.3)",
              borderRadius: "10px",
              padding: "8px 10px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(168,85,247,0.35)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(168,85,247,0.2)")
            }
          >
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
                transition: "all 0.2s",
              }}
            />
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
                transition: "all 0.2s",
              }}
            />
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
                transition: "all 0.2s",
              }}
            />
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
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 150,
              animation: "fadeIn 0.2s ease",
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: "fixed",
              top: "72px",
              right: "20px",
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              padding: "8px",
              zIndex: 200,
              minWidth: "200px",
              animation: "slideDown 0.3s ease",
            }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                color: "#374151",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "20px" }}>👤</span>
              Mi Cuenta
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                color: "#374151",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "20px" }}>📦</span>
              Mis Pedidos
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                color: "#374151",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "20px" }}>💰</span>
              Mi Saldo
            </button>

            <div
              style={{ height: "1px", background: "#e5e7eb", margin: "8px 0" }}
            />

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "transparent",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                color: "#dc2626",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fee2e2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span style={{ fontSize: "20px" }}>🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}

      {/* Main Content */}
      <main
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        {/* Carrusel de Restaurantes */}
        <RestaurantCarousel restaurantes={restaurantes} />

        {/* Barra de búsqueda con sugerencias */}
        <div style={{ marginTop: 12, marginBottom: 18, position: "relative" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Buscar restaurantes o platillos..."
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e6e7eb",
              outline: "none",
              fontSize: 14,
            }}
          />

          {showSuggestions &&
            search.trim().length > 0 &&
            suggestions.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  background: "rgba(255,255,255,0.98)",
                  border: "1px solid #e6e7eb",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(2,6,23,0.06)",
                  zIndex: 40,
                  maxHeight: 260,
                  overflow: "auto",
                }}
              >
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    onMouseDown={() => {
                      // onMouseDown para evitar que el blur oculte antes del click
                      if (s.type === "restaurante")
                        navigate(`/restaurante/${s.id}`);
                      else if (s.type === "platillo") {
                        if (s.restaurante && s.restaurante.id)
                          navigate(`/restaurante/${s.restaurante.id}`);
                      }
                    }}
                    style={{
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      cursor: "pointer",
                      borderBottom:
                        idx < suggestions.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>
                        {s.nombre}
                      </div>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {s.type === "restaurante" ? "Restaurante" : "Platillo"}
                      </div>
                    </div>
                    {s.descripcion && (
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {s.descripcion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Carrusel infinito de platillos */}
        <PlatillosCarousel
          platillos={platillos.sort(() => Math.random() - 0.5)}
        />

        {/* Categorías / Platillos */}
        <section>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#111827",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "28px" }}>🍽️</span>
            ¿Qué se te antoja hoy?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "14px",
            }}
          >
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  onClick={() => navigate(`/categoria/${categoria.id}`)}
                  style={{
                    background: `linear-gradient(135deg, ${categoria.color_gradiente_inicio} 0%, ${categoria.color_gradiente_fin} 100%)`,
                    borderRadius: "16px",
                    padding: "20px 16px",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 18px rgba(102,126,234,0.3)",
                    minHeight: "140px",
                    /* Forma orgánica (hoja) */
                    clipPath: "ellipse(65% 60% at 30% 35%)",
                    WebkitClipPath: "ellipse(65% 60% at 30% 35%)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(102,126,234,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 18px rgba(102,126,234,0.3)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-15px",
                      right: "-15px",
                      fontSize: "90px",
                      opacity: 0.15,
                    }}
                  >
                    {categoria.emoji}
                  </div>
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                      {categoria.emoji}
                    </div>
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "17px",
                        fontWeight: 700,
                        margin: "0 0 6px 0",
                      }}
                    >
                      {categoria.nombre}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Fallback si no hay categorías */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "16px",
                    padding: "20px 16px",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    minHeight: "140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    /* Forma orgánica (hoja) */
                    clipPath: "ellipse(65% 60% at 30% 35%)",
                    WebkitClipPath: "ellipse(65% 60% at 30% 35%)",
                  }}
                >
                  Cargando...
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <BottomNav />

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
