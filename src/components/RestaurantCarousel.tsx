import { useRef } from "react";
import { useNavigate } from "react-router-dom";

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

interface Props {
  restaurantes: Restaurante[];
}

export default function RestaurantCarousel({ restaurantes }: Props) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (restaurantes.length === 0) {
    return (
      <section style={{ marginBottom: "24px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
            height: "160px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
          }}
        >
          <p style={{ color: "#fff", fontSize: "15px", fontWeight: 500 }}>
            No hay restaurantes disponibles
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "24px" }}>
      <div
        style={{
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "8px 16px",
        }}
      >
        {/* Contenedor horizontal scroll de cards (sin scrollbar visible) */}
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none;} .hide-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }`}</style>
        <div
          ref={containerRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "8px",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {restaurantes.map((restaurant) => (
            <div
              key={restaurant.id}
              style={{
                minWidth: "210px",
                flex: "0 0 auto",
                borderRadius: "10px",
                overflow: "hidden",
                background: "transparent",
                boxShadow: "none",
                border: "1px solid rgba(15,23,42,0.06)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                backdropFilter: "none",
              }}
              onClick={() => navigate(`/restaurante/${restaurant.id}`)}
            >
              <div
                style={{
                  height: "110px",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${restaurant.imagen_url})`,
                }}
              />
              <div
                style={{
                  padding: "10px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {restaurant.nombre}
                  </h4>
                  <span style={{ fontSize: "18px" }}>{restaurant.emoji}</span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#475569" }}>
                  {restaurant.descripcion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
