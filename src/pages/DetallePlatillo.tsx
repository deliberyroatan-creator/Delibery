import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

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

export default function DetallePlatillo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [platillo, setPlatillo] = useState<Platillo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    cargar();
  }, [id]);

  async function cargar() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("platillos")
        .select(
          `id,nombre,descripcion,imagen_url,precio,disponible,restaurante_id,restaurantes(id,nombre)`
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error cargando platillo:", error);
        setPlatillo(null);
      } else if (data) {
        const restInfo = Array.isArray(data.restaurantes)
          ? data.restaurantes[0]
          : data.restaurantes;
        const mapped = {
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          imagen_url: data.imagen_url,
          precio: data.precio,
          disponible: data.disponible,
          restaurante_id: data.restaurante_id,
          restaurante: restInfo
            ? { id: restInfo.id, nombre: restInfo.nombre }
            : null,
        };
        setPlatillo(mapped);
      }
    } catch (err) {
      console.error(err);
      setPlatillo(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>⏳</div>
          <p style={{ color: "#6b7280", marginTop: 12 }}>
            Cargando platillo...
          </p>
        </div>
      </div>
    );
  }

  if (!platillo) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 48 }}>😕</div>
        <p style={{ color: "#6b7280" }}>Platillo no encontrado</p>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "#fafafa", paddingBottom: 80 }}
    >
      <div style={{ position: "relative" }}>
        <div
          style={{
            height: 260,
            backgroundImage: `url(${
              platillo.imagen_url || "/placeholder.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.95)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ←
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "20px 16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          maxWidth: 700,
          margin: "-40px auto 0 auto",
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              {platillo.nombre}
            </h1>
            {platillo.descripcion && (
              <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                {platillo.descripcion}
              </p>
            )}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>
                ${(platillo.precio || 0).toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: platillo.disponible ? "#374151" : "#dc2626",
                }}
              >
                {platillo.disponible ? "Disponible" : "No disponible"}
              </div>
            </div>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 12,
              overflow: "hidden",
              flex: "0 0 120px",
            }}
          >
            <img
              src={platillo.imagen_url || "/placeholder.png"}
              alt={platillo.nombre}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
          {platillo.restaurante && (
            <button
              onClick={() =>
                navigate(`/restaurante/${platillo.restaurante?.id}`)
              }
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Ver restaurante
            </button>
          )}
          <button
            disabled={!platillo.disponible}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: platillo.disponible ? "#059669" : "#9ca3af",
              color: "#fff",
              cursor: platillo.disponible ? "pointer" : "not-allowed",
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}
