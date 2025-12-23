import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Restaurantes", icon: "🍽️", path: "/restaurantes" },
    { label: "Inicio", icon: "🏠", path: "/home", isCenter: true },
    { label: "Mi Cuenta", icon: "👤", path: "/mi-cuenta" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      style={styles.navContainer as any}
    >
      {/* Curved Background - Slightly adjusted for a modern feel */}
      <svg
        width="100%"
        height="85"
        viewBox="0 0 375 85"
        preserveAspectRatio="none"
        style={styles.svgBackground as any}
      >
        <defs>
          <linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo más vibrante */}
            <stop offset="100%" stopColor="#7c3aed" /> {/* Púrpura */}
          </linearGradient>
          {/* Un filtro para un efecto de "neón" o glow más suave en el borde */}
          <filter id="glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="atop" />
          </filter>
        </defs>
        <path
          d="M 0 35 Q 93.75 0 187.5 0 Q 281.25 0 375 35 L 375 85 L 0 85 Z"
          fill="url(#navGradient)"
          style={{
            filter: "url(#glow) drop-shadow(0 -6px 20px rgba(0,0,0,0.4))",
          }} // Más sombra
        />
      </svg>

      <div style={styles.buttonWrapper as any}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon; // Emoji string

          if (item.isCenter) {
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(item.path)}
                style={styles.centerButton as any}
              >
                <motion.div
                  initial={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                  animate={{
                    background: isActive
                      ? "linear-gradient(135deg, #a78bfa, #c4b5fd)"
                      : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={styles.centerButtonGlow as any}
                />
                <motion.span
                  key="center-icon"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.2 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    fontSize: "32px",
                    color: isActive ? "#4f46e5" : "#fff",
                  }}
                >
                  <span>{IconComponent}</span>
                </motion.span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate(item.path)}
              style={styles.sideButton as any}
            >
              <motion.div
                initial={{ color: "#a7a7a7" }}
                animate={{ color: isActive ? "#fff" : "#a7a7a7" }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: "24px" }}
              >
                <span>{IconComponent}</span>
              </motion.div>
              <motion.span
                initial={{ opacity: 0.7 }}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
                style={styles.label as any}
              >
                {item.label}
              </motion.span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  style={styles.activeDot as any}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}

const styles = {
  navContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    // Eliminamos el overflow hidden para permitir el efecto de sombra del botón central
  },
  svgBackground: {
    display: "block",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%", // Asegura que cubra todo el ancho
  },
  buttonWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "flex-end",
    padding: "0 10px 10px 10px",
    height: "85px", // Ajusta a la altura del SVG
  },
  sideButton: {
    background: "transparent",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    width: "80px",
    paddingBottom: "8px", // Espacio para el punto activo
    position: "relative", // Para posicionar el punto activo
  },
  centerButton: {
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    marginBottom: "35px", // Empuja más hacia arriba para la curva
    position: "relative",
    zIndex: 1, // Asegura que el botón esté por encima del SVG
  },
  centerButtonGlow: {
    position: "absolute",
    inset: "-4px", // Un poco más grande para un glow más notable
    borderRadius: "50%",
    zIndex: -1,
    // El background se animará directamente en el componente
  },
  label: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: 600,
    marginTop: "6px",
    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
  activeDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    marginTop: "4px",
    position: "absolute",
    bottom: "0px", // Posiciona el punto en la parte inferior del botón
  },
};
