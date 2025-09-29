import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Pedido.css'; // Estilos

// URL base de tu controlador: https://localhost:7232/api/Order
const API_URL = 'https://localhost:7232/api/Order';

const DetallePedido = () => {
    const { id } = useParams(); // Obtiene el 'id' de la URL (RF7)
    const navigate = useNavigate();
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState(null); // Mensaje de éxito al cambiar estado

    // ------------------------------------------
    // 1. Funciones de API (Obtener y Actualizar Estado)
    // ------------------------------------------

    // Función para obtener el pedido por ID (RF7, RF10)
    const fetchPedidoDetalles = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const token = localStorage.getItem('token');
            const url = `${API_URL}/${id}`; 
            
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 404) {
                throw new Error("Pedido no encontrado.");
            }
            if (!response.ok) {
                throw new Error(`Error al cargar el pedido: ${response.statusText}`);
            }

            const data = await response.json();
            setPedido(data); 

        } catch (err) {
            setError(err.message);
            console.error('Error fetching pedido details:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Función para cambiar el estado del pedido (RF10)
    const handleEstadoChange = async (action) => {
        setStatusMessage(null);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // La URL usa el endpoint definido en tu OrderController: /api/Order/{id}/iniciar, /api/Order/{id}/entregar, etc.
            const url = `${API_URL}/${id}/${action}`; 
            
            const response = await fetch(url, {
                method: 'POST', // Tu controlador usa POST para los cambios de estado
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                setStatusMessage(`Estado cambiado a ${action.toUpperCase()} exitosamente.`);
                // Recarga los detalles para ver el nuevo estado
                await fetchPedidoDetalles(); 
            } else {
                setError(`Fallo al cambiar estado: ${result.message || 'Error desconocido'}`);
            }

        } catch (err) {
            setError(`Error de red al actualizar el estado.`);
            console.error('Error updating status:', err);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------
    // 2. Efectos
    // ------------------------------------------
    useEffect(() => {
        fetchPedidoDetalles(); 
    }, [fetchPedidoDetalles]);

    // ------------------------------------------
    // 3. Renderizado
    // ------------------------------------------
    if (loading && !pedido) return <p>Cargando detalle del pedido #{id}...</p>;
    if (error) return <p className="error-message">Error al cargar: {error}</p>;
    if (!pedido) return <p>No se encontraron datos para el pedido #{id}.</p>;

    return (
        <div className="detalle-container">
            <header className="detalle-header">
                <h2>Detalles del Pedido #{pedido.idPedido}</h2>
                <div className={`estado-tag estado-${pedido.estado}`}>
                    {pedido.estadoDescripcion}
                </div>
            </header>

            {statusMessage && <p className="success-message">{statusMessage}</p>}
            
            {/* Sección de Gestión de Estados (RF10) */}
            <div className="status-management">
                <h3>Gestión de Estado</h3>
                <button 
                    onClick={() => handleEstadoChange('iniciar')} 
                    disabled={loading || pedido.estado >= 2} // Deshabilita si ya está en proceso o más avanzado
                    className="btn-status"
                >
                    Iniciar Producción
                </button>
                <button 
                    onClick={() => handleEstadoChange('producir')} 
                    disabled={loading || pedido.estado >= 3} 
                    className="btn-status"
                >
                    Finalizar Producción
                </button>
                <button 
                    onClick={() => handleEstadoChange('entregar')} 
                    disabled={loading || pedido.estado === 4} 
                    className="btn-status"
                >
                    Marcar Entregado
                </button>
                <button 
                    onClick={() => handleEstadoChange('cancelar')} 
                    disabled={loading || pedido.estado === 5} 
                    className="btn-status btn-cancel"
                >
                    Cancelar Pedido
                </button>
            </div>
            
            <hr />

            {/* Información General del Pedido (RF7) */}
            <div className="info-card">
                <h3>Información General</h3>
                <p><strong>Cliente:</strong> {pedido.clienteNombre} ({pedido.clienteEmail})</p>
                <p><strong>Fecha Registro:</strong> {new Date(pedido.fechaRegistro).toLocaleDateString()}</p>
                <p><strong>Fecha Entrega:</strong> {new Date(pedido.fechaEntrega).toLocaleDateString()} {pedido.estaVencido && <span className="vencido-tag">(Vencido)</span>}</p>
                <p><strong>Última Actualización:</strong> {pedido.fechaActualizacion ? new Date(pedido.fechaActualizacion).toLocaleString() : 'N/A'}</p>
            </div>
            
            <hr />

            {/* Detalles de Productos (RF8, RF9) */}
            <div className="detalles-producto">
                <h3>Productos Solicitados ({pedido.totalItems} ítems)</h3>
                <table className="detalle-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>P. Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Asumiendo que tu DTO PedidoInfoDto tiene una propiedad 'detallesPedido' */}
                        {pedido.detallesPedido && pedido.detallesPedido.map((detalle, index) => (
                            <tr key={index}>
                                <td>{detalle.productoNombre}</td>
                                <td>{detalle.cantidad} (RF9)</td>
                                <td>${detalle.precioUnitario?.toFixed(2)}</td>
                                <td>${(detalle.cantidad * detalle.precioUnitario)?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer className="detalle-footer">
                <p className="total-final"><strong>TOTAL PEDIDO:</strong> ${pedido.totalPedido?.toFixed(2)}</p>
                <button className="btn-volver" onClick={() => navigate('/pedidos/consultar')}>Volver a Consultar</button>
            </footer>
        </div>
    );
};

export default DetallePedido;