import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
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
        {/* Logo + Título */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.png" alt="Delibery" style={{ height: 44 }} />
          <div
            style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}
          >
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>
              Food Delibery Roatan
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginTop: 2,
              }}
            >
              Tu comida, más cerca
            </div>
          </div>
        </div>

        {/* Menu Icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
          >
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
              }}
            />
            <div
              style={{
                width: "22px",
                height: "2.5px",
                background: "#c084fc",
                borderRadius: "2px",
              }}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
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
            }}
          />

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
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
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
              }}
            >
              <span style={{ fontSize: "20px" }}>👤</span>
              Mi Cuenta
            </button>

            <button
              onClick={() => setMenuOpen(false)}
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
              }}
            >
              <span style={{ fontSize: "20px" }}>📦</span>
              Mis Pedidos
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
              }}
            >
              <span style={{ fontSize: "20px" }}>🚪</span>
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </header>
  );
}
