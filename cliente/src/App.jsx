import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// importar login
import Login from "./compomentes/InicioSesion/login";
//importar barras de navegacion y dashboard
import BarraLateral from "./compomentes/menu/BarraLateral";
import BarraSuperior from "./compomentes/menu/BarraSuperior";
import Dashboard from "./compomentes/DashBoard/Dashboard";
//importaciones para empleados
import MenuEmpleado from "./compomentes/Empleados/MenuEmpleado";
//importaciones para clientes
import MenuCliente from "./compomentes/Clientes/MenuCliente";
import Listarcliente from "./compomentes/Clientes/Listarcliente";
//importaciones para stock
import MenuStock from "./compomentes/Stock/MenuStock";
//importaciones para pedidps
import MenuPedido from "./compomentes/Pedidos/MenuPedido";
//importaciones para tareas
import MenuTarea from "./compomentes/Tareas/MenuTarea";
//importaciones para reposrtes
import MenuReporte from "./compomentes/Reportes/MenuReporte";
//importaciones para el perfil de usuario 
import Perfil from "./compomentes/Perfil/Perfil";

const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px',
    color: '#667eea'
  }}>
    <div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      Verificando autenticación...
    </div>
  </div>
);
// Componente principal de la aplicación (protegido)
const MainApp = () => {
  return (
    <div style={{ marginLeft: 80, marginTop: 60, padding: 20 }}>
      <BarraLateral />
      <BarraSuperior />
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Rutas para empleados */}
        <Route path="/empleados" element={<MenuEmpleado />} />
        
        {/* Rutas para clientes */}
        <Route path="/clientes" element={<MenuCliente />} />
        <Route path="/listarcliente" element={<Listarcliente />} />
        
        {/* Rutas para Stock */}
        <Route path="/stock" element={<MenuStock />} />
        
        {/* Rutas para pedidos */}
        <Route path="/pedidos" element={<MenuPedido />} />
        
        {/* Rutas para tareas */}
        <Route path="/tareas" element={<MenuTarea />} />
        
        {/* Rutas para reportes */}
        <Route path="/reportes" element={<MenuReporte />} />
        {/* Rutas para usuarios */}
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </div>
  );
};
// Componente que decide qué mostrar basado en la autenticación
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar pantalla de carga mientras verifica la autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Si está autenticado, mostrar la aplicación principal
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </AuthProvider>
  );
}

export default App;



