import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Stock.css';

const MenuStock = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-stok-wrapper">
      <h2>Stok</h2>
      <div className="menu-stok-grid">
        <button className="btn blue">
          <span className="icon">+</span> Registrar material
        </button>
        <button className="btn orange">
          <span className="icon">✔</span> Consultar matrial
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