import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Stock.css';

const MenuStock = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-stock-wrapper">
      <h2>Stock</h2>
      <div className="menu-stock-grid">
        <button className="btn blue" onClick={() => navigate('/registrar-material')}>
          <span className="icon">+</span> Registrar material
        </button>
        <button className="btn orange" onClick={() => navigate('/listar-material')}>
          <span className="icon">✔</span> Consultar material
        </button>
        <button className="btn green">
          <span className="icon">📋</span> Generar reporte general
        </button>
      </div>
      <div className="volver-container">
        <button className="volver" onClick={() => navigate('/')}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default MenuStock;