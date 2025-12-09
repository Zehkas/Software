import { Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage'; 
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; 
import AdminDashboard from './pages/admin/AdminDashboard'; 
import CatalogPage from './pages/CatalogPage';       
import OrdersPage from './pages/OrdersPage';         
import ProfilePage from './pages/ProfilePage';       
import PresetManagementPage from './pages/admin/PresetManagementPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomOrderPage from './pages/CustomOrderPage'; 

function App() {
  return (
    <Routes>
      {/* RUTAS DE AUTENTICACIÓN */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/home" element={<HomePage />} /> 
      
      {/* Navegación Principal */}
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/orders" element={<OrdersPage />} /> 
      <Route path="/profile" element={<ProfilePage />} /> 
      
      {/* Procesos de Compra */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/custom-order" element={<CustomOrderPage />} />

      {/* RUTAS DE ADMINISTRADOR */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
      <Route path="/admin/presets" element={<PresetManagementPage />} /> 
      <Route path="/admin/pedidos" element={<AdminOrdersPage />} /> 

      <Route path="*" element={<div style={{textAlign:'center', marginTop:'50px'}}>Página no encontrada (404)</div>} />
    </Routes>
  );
}

export default App;