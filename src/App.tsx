import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import HomeClient from "./pages/HomeClient";
import Platillos from "./pages/Platillos";
import Categoria from "./pages/Categoria";
import "./App.css";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  return usuario ? <>{children}</> : <Navigate to="/" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  return !usuario ? <>{children}</> : <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeClient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/platillos/:categoriaId"
        element={
          <ProtectedRoute>
            <Platillos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categoria/:id"
        element={
          <ProtectedRoute>
            <Categoria />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
