import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';

const API_ALL_ORDERS = 'http://localhost:3000/api/orders/all';
const API_UPDATE_STATUS = 'http://localhost:3000/api/orders/status';
const API_GET_FILES = 'http://localhost:3000/api/orders';

interface OrderAdmin {
    ID_PEDIDO: number;
    USUARIO_NOMBRE: string;
    USUARIO_EMAIL: string;
    FECHA_PEDIDO: string;
    MONTO_TOTAL: number;
    TIPO_PEDIDO: 'PRESET' | 'CUSTOM';
    ESTADO_PEDIDO: string;
    PRESET_NOMBRE?: string;
    TITULO_CUSTOM?: string;
}

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderAdmin[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_ALL_ORDERS);
            setOrders(response.data);
        } catch (error) {
            alert("Error al cargar pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await axios.put(`${API_UPDATE_STATUS}/${orderId}`, { estado: newStatus });
            setOrders(prev => prev.map(o => o.ID_PEDIDO === orderId ? { ...o, ESTADO_PEDIDO: newStatus } : o));
        } catch (error) {
            alert("Error al actualizar estado.");
        }
    };

    const handleDownload = async (orderId: number) => {
        try {
            const response = await axios.get(`${API_GET_FILES}/${orderId}/files`);
            const files = response.data;

            if (files.length === 0) {
                alert("Este pedido no tiene archivos adjuntos.");
                return;
            }

            for (const file of files) {
                const fileUrl = `http://localhost:3000${file.RUTA_ARCHIVO}`;
                const fileName = file.NOMBRE_ARCHIVO || `archivo_pedido_${orderId}_${Math.floor(Math.random() * 1000)}`;

                try {
                    const fileResponse = await axios.get(fileUrl, { responseType: 'blob' });
                    const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode?.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (downloadError) {
                    console.error("Error descargando archivo:", downloadError);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error al obtener archivos.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ENTREGADO': return '#16a34a';
            case 'ENVIADO': return '#2563eb'; 
            case 'EN PROCESO': return '#d97706';
            case 'PENDIENTE': return '#dc2626'; 
            default: return '#4b5563';  
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'ENTREGADO': return '#dcfce7'; 
            case 'ENVIADO': return '#dbeafe';   
            case 'EN PROCESO': return '#fef3c7'; 
            case 'PENDIENTE': return '#fee2e2';  
            default: return '#f3f4f6';          
        }
    };

    return (
        <div style={styles.mainLayout}>
            <Header />
            <div style={styles.content}>
                <div style={styles.headerSection}>
                    <h1 style={styles.title}>Gestión de Pedidos</h1>
                    <p style={styles.subtitle}>Administra y supervisa todas las transacciones de la plataforma.</p>
                </div>
                
                <div style={styles.tableCard}>
                    <div style={styles.tableResponsive}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeaderRow}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Cliente</th>
                                    <th style={styles.th}>Detalle Producto</th>
                                    <th style={styles.th}>Tipo</th>
                                    <th style={styles.th}>Fecha</th>
                                    <th style={styles.th}>Total</th>
                                    <th style={styles.th}>Archivos</th>
                                    <th style={styles.th}>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.ID_PEDIDO} style={styles.tableRow}>
                                        <td style={styles.tdId}>#{order.ID_PEDIDO}</td>
                                        
                                        <td style={styles.td}>
                                            <div style={styles.clientName}>{order.USUARIO_NOMBRE}</div>
                                            <div style={styles.clientEmail}>{order.USUARIO_EMAIL}</div>
                                        </td>
                                        
                                        <td style={styles.tdProduct}>
                                            {order.TIPO_PEDIDO === 'CUSTOM' ? (
                                                <span title="Pedido Personalizado">{order.TITULO_CUSTOM}</span>
                                            ) : (
                                                <span>{order.PRESET_NOMBRE}</span>
                                            )}
                                        </td>
                                        
                                        <td style={styles.td}>
                                            <span style={order.TIPO_PEDIDO === 'CUSTOM' ? styles.badgeCustom : styles.badgePreset}>
                                                {order.TIPO_PEDIDO}
                                            </span>
                                        </td>
                                        
                                        <td style={styles.tdDate}>
                                            {new Date(order.FECHA_PEDIDO).toLocaleDateString('es-ES', {
                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                            })}
                                        </td>

                                        <td style={styles.tdPrice}>${order.MONTO_TOTAL.toFixed(2)}</td>
                                        
                                        <td style={styles.td}>
                                            {order.TIPO_PEDIDO === 'CUSTOM' ? (
                                                <button 
                                                    onClick={() => handleDownload(order.ID_PEDIDO)}
                                                    style={styles.downloadBtn}
                                                    title="Descargar referencias del cliente"
                                                >
                                                    📥 Descargar
                                                </button>
                                            ) : (
                                                <span style={styles.noFiles}>-</span>
                                            )}
                                        </td>

                                        <td style={styles.td}>
                                            <div style={styles.selectWrapper}>
                                                <select 
                                                    value={order.ESTADO_PEDIDO}
                                                    onChange={(e) => handleStatusChange(order.ID_PEDIDO, e.target.value)}
                                                    style={{
                                                        ...styles.statusSelect,
                                                        borderColor: getStatusColor(order.ESTADO_PEDIDO),
                                                        color: getStatusColor(order.ESTADO_PEDIDO),
                                                        backgroundColor: getStatusBg(order.ESTADO_PEDIDO)
                                                    }}
                                                >
                                                    <option value="PENDIENTE">⏳ PENDIENTE</option>
                                                    <option value="EN PROCESO">⚙️ EN PROCESO</option>
                                                    <option value="ENVIADO">📨 ENVIADO</option>
                                                    <option value="ENTREGADO">✅ ENTREGADO</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {!loading && orders.length === 0 && (
                        <div style={styles.emptyState}>
                            No hay pedidos registrados en el sistema.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainLayout: { 
        minHeight: '100vh', 
        backgroundColor: '#f3f4f6', 
        fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif" 
    },
    content: { 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
    },
    
    headerSection: { marginBottom: '30px' },
    title: { color: '#1f2937', fontSize: '1.8rem', marginBottom: '8px', fontWeight: '700' as '700' },
    subtitle: { color: '#6b7280', fontSize: '1rem' },

    tableCard: { 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
    },
    tableResponsive: { overflowX: 'auto' as 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' as 'collapse', minWidth: '900px' },
    
    tableHeaderRow: { backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
    th: { 
        padding: '16px 24px', textAlign: 'left' as 'left', color: '#4b5563', 
        fontSize: '0.75rem', fontWeight: '700' as '700', textTransform: 'uppercase' as 'uppercase', letterSpacing: '0.05em' 
    },
    
    tableRow: { borderBottom: '1px solid #f1f1f1', transition: 'background-color 0.15s ease-in-out' },
    td: { padding: '16px 24px', verticalAlign: 'middle', color: '#374151', fontSize: '0.9rem' },
    tdId: { padding: '16px 24px', verticalAlign: 'middle', color: '#6b7280', fontSize: '0.85rem', fontFamily: 'monospace' },
    tdProduct: { padding: '16px 24px', verticalAlign: 'middle', fontWeight: '500' as '500', color: '#111827' },
    tdDate: { padding: '16px 24px', verticalAlign: 'middle', color: '#6b7280', fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums' as 'tabular-nums' },
    tdPrice: { padding: '16px 24px', verticalAlign: 'middle', fontWeight: '600' as '600', color: '#059669' },

    clientName: { fontWeight: '600' as '600', color: '#111827', fontSize: '0.95rem' },
    clientEmail: { fontSize: '0.8rem', color: '#9ca3af' },

    badgeCustom: { 
        backgroundColor: '#fdf2f8', color: '#db2777', 
        padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' as '600', 
        border: '1px solid #fbcfe8', display: 'inline-block'
    },
    badgePreset: { 
        backgroundColor: '#eff6ff', color: '#2563eb', 
        padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' as '600', 
        border: '1px solid #bfdbfe', display: 'inline-block'
    },
    
    downloadBtn: {
        backgroundColor: 'white', color: '#4f46e5', border: '1px solid #c7d2fe', 
        padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', 
        fontWeight: '500' as '500', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px',
        whiteSpace: 'nowrap' as 'nowrap'
    },
    noFiles: { color: '#d1d5db', fontSize: '1.2rem', textAlign: 'center' as 'center', display: 'block' },

    selectWrapper: { position: 'relative' as 'relative' },
    statusSelect: {
        padding: '8px 12px',
        borderRadius: '8px',
        border: '2px solid',
        fontWeight: '700' as '700',
        fontSize: '0.85rem',
        cursor: 'pointer',
        outline: 'none',
        width: '100%',
        minWidth: '140px',
        appearance: 'none' as 'none',
        textAlign: 'center' as 'center'
    },

    emptyState: { textAlign: 'center' as 'center', padding: '60px 20px', color: '#9ca3af', fontSize: '1rem' }
};

export default AdminOrdersPage;