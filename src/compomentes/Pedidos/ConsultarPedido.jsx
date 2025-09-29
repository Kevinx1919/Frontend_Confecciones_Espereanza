import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pedido.css';

const API_BASE_URL = 'https://localhost:7232/api/Order';

const getPedidos = async ({
  clienteId = '',
  estado = '',
  fechaDesde = '',
  fechaHasta = '',
  estaVencido = '',
  pageNumber = 1,
  pageSize = 10
} = {}) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams();

  if (clienteId) params.append('ClienteId', clienteId);
  if (estado) params.append('Estado', estado);
  if (fechaDesde) params.append('FechaDesde', fechaDesde);
  if (fechaHasta) params.append('FechaHasta', fechaHasta);
  if (estaVencido !== '') params.append('EstaVencido', estaVencido);
  params.append('PageNumber', pageNumber);
  params.append('PageSize', pageSize);

  const url = `${API_BASE_URL}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor' }));
    throw new Error(errorData.message || 'Error al obtener los pedidos');
  }

  return response.json();
};

const ConsultarPedido = () => {
  const navigate = useNavigate();

  // Filtros
  const [clienteId, setClienteId] = useState('');
  const [estado, setEstado] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [estaVencido, setEstaVencido] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pedidosPorPagina = 10;

  // Datos
  const [pedidos, setPedidos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Estado de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar pedidos con filtros y paginación
  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getPedidos({
        clienteId,
        estado,
        fechaDesde,
        fechaHasta,
        estaVencido,
        pageNumber: currentPage,
        pageSize: pedidosPorPagina
      });

      setPedidos(data.pedidos || []);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar pedidos al montar y cuando cambian filtros/paginación
  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId, estado, fechaDesde, fechaHasta, estaVencido, currentPage]);

  // Handlers de paginación
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalCount / pedidosPorPagina)));

  const handleVolver = () => navigate('/pedidos/menu');

  // Render
  if (loading) {
    return (
      <div className="consulta-container">
        <h2>Cargando pedidos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consulta-container">
        <h2>❌ Error al cargar los datos: {error}</h2>
        <button onClick={fetchPedidos} className="btn blue" style={{ marginTop: '20px' }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="consulta-container">
      <div className="acciones-header">
        <h2>Lista de Pedidos</h2>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="ID de cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="">Todos los estados</option>
            <option value="1">Pendiente</option>
            <option value="2">En Proceso</option>
            <option value="3">En Producción</option>
            <option value="4">Completado</option>
            <option value="5">Cancelado</option>
            <option value="6">Entregado</option>
          </select>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <select
            value={estaVencido}
            onChange={(e) => setEstaVencido(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="">Vencidos y no vencidos</option>
            <option value="true">Solo vencidos</option>
            <option value="false">Solo no vencidos</option>
          </select>
          <button onClick={() => { setCurrentPage(1); fetchPedidos(); }} className="btn purple">
            Aplicar Filtros
          </button>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No se encontraron pedidos.</h3>
          <p>Ajusta tus filtros o verifica la base de datos.</p>
        </div>
      ) : (
        <>
          <table className="tabla-clientes">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Items</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.idPedido}>
                  <td>{pedido.idPedido}</td>
                  <td>{pedido.clienteNombre}</td>
                  <td>{pedido.clienteEmail}</td>
                  <td>{new Date(pedido.fechaRegistro).toLocaleDateString()}</td>
                  <td>{new Date(pedido.fechaEntrega).toLocaleDateString()}</td>
                  <td>
                    {pedido.estadoDescripcion}
                    {pedido.estaVencido && <span style={{ color: '#e74c3c', marginLeft: '5px', fontSize: '0.9em' }}>(Vencido)</span>}
                  </td>
                  <td>${pedido.totalPedido?.toFixed(2)}</td>
                  <td>{pedido.totalItems}</td>
                  <td>
                    <button 
                      onClick={() => navigate(`/pedidos/detalle/${pedido.idPedido}`)}
                      className="btn purple"
                      style={{ padding: '8px 12px', fontSize: '14px' }}
                    >
                      Ver Detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="paginacion-controles">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="btn purple"
              style={{ padding: '10px 20px', fontSize: '14px', opacity: currentPage === 1 ? '0.6' : '1' }}
            >
              ← Anterior
            </button>
            <span style={{ margin: '0 20px', fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
              Página {currentPage} de {Math.ceil(totalCount / pedidosPorPagina)}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === Math.ceil(totalCount / pedidosPorPagina) || totalCount === 0}
              className="btn purple"
              style={{ padding: '10px 20px', fontSize: '14px', opacity: currentPage === Math.ceil(totalCount / pedidosPorPagina) || totalCount === 0 ? '0.6' : '1' }}
            >
              Siguiente →
            </button>
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px', paddingRight: '20px' }}>
        <button 
          onClick={handleVolver}
          className="volver purple"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ConsultarPedido;