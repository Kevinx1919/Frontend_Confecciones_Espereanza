import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'https://localhost:7232/api/Customer';

function EliminarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
        const token = localStorage.getItem('token'); 
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar cliente');
      alert('Cliente eliminado con éxito');
      navigate('/clientes');
    } catch {
      alert('Ocurrió un error al eliminar el cliente.');
    }
  };

  return (
    <div>
      <h2>¿Seguro que deseas eliminar este cliente?</h2>
      <button onClick={handleDelete}>Sí, eliminar</button>
      <button onClick={() => navigate('/clientes')}>Cancelar</button>
    </div>
  );
}

export default EliminarCliente;