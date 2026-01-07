import { useRef, useEffect } from "react";
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
  const autoScrollInterval = useRef<number | null>(
    null as unknown as number | null
  );
  const isHovered = useRef(false);

  // iniciar autoplay
  useAutoScroll(containerRef, isHovered, autoScrollInterval);

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
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
          style={{
            display: "flex",
            gap: "12px",
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
                minWidth: "160px",
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
                  height: "90px",
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
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {restaurant.nombre}
                  </h4>
                  <span style={{ fontSize: "16px" }}>{restaurant.emoji}</span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>
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

// Autoplay: start automatic scroll when component mounts
function useAutoScroll(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isHoveredRef: React.MutableRefObject<boolean>,
  intervalRef: React.MutableRefObject<number | null>
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function step() {
      if (!container) return;
      if (isHoveredRef.current) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) return;
      const current = container.scrollLeft;
      const delta = Math.round(container.clientWidth * 0.5);
      if (current >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const move = Math.min(delta, maxScroll - current);
        container.scrollBy({ left: move, behavior: "smooth" });
      }
    }

    intervalRef.current = window.setInterval(step, 3000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [containerRef, isHoveredRef, intervalRef]);
}

// Hook usage: start auto scroll inside module scope to keep component code tidy
// Note: this will run for each import; it's fine because the hook is pure and tied to refs passed.
// We expose the hook above and call it from the component by referring to the refs defined there.
