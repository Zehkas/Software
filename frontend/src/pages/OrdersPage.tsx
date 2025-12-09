import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000/api/orders';

interface OrderItem {
    ID_PEDIDO: number;
    FECHA_PEDIDO: string;
    MONTO_TOTAL: number;
    ESTADO_PEDIDO: string;
    TIPO_PEDIDO: 'PRESET' | 'CUSTOM';
    PRESET_NOMBRE?: string;
    PRESET_DESCRIPCION?: string; 
    IMAGEN_PRESET?: string; 
    TITULO_CUSTOM?: string;
    DESCRIPCION_CUSTOM?: string;
    IMAGEN_CUSTOM?: string; 
}

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const getUserId = () => {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        try {
            const u = JSON.parse(userString);
            return u.id_usuario || u.id;
        } catch { return null; }
    };

    const fetchOrders = async () => {
        const userId = getUserId();
        if (!userId) {
            setError("No ha iniciado sesión.");
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
            setOrders(response.data);
            setError('');
        } catch (err) {
            setError("Error al cargar el historial.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const year = date.getFullYear();
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        
        return `${day} de ${capitalizedMonth} de ${year}`;
    };

    return (
        <div style={styles.mainLayout}>
            <Header />
            <div style={styles.content}>
                
                <h1 style={styles.pageTitle}>Mis Pedidos 📦</h1>

                {loading && <p style={{textAlign: 'center', color:'#666'}}>Cargando historial...</p>}
                
                {!loading && orders.length === 0 && (
                    <div style={styles.emptyState}>
                        <p>Aún no has realizado ningún pedido.</p>
                        <button onClick={() => navigate('/catalog')} style={styles.browseButton}>Explorar Catálogo</button>
                    </div>
                )}
                
                <div style={styles.orderList}>
                    {!loading && orders.map((order) => {
                        const isCustom = order.TIPO_PEDIDO === 'CUSTOM';
                        const title = isCustom ? order.TITULO_CUSTOM : order.PRESET_NOMBRE;
                        const description = isCustom 
                            ? order.DESCRIPCION_CUSTOM 
                            : order.PRESET_DESCRIPCION || 'Sin descripción disponible'; 
                        
                        let imagePath = isCustom ? order.IMAGEN_CUSTOM : order.IMAGEN_PRESET;
                        const imageUrl = imagePath 
                            ? `http://localhost:3000${imagePath}` 
                            : 'https://via.placeholder.com/150?text=Sin+Imagen';

                        return (
                            <div key={order.ID_PEDIDO} style={styles.orderCard}>
                                
                                <div style={styles.cardHeader}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                        <h3 style={styles.orderTitle}>
                                            Pedido #{order.ID_PEDIDO}
                                        </h3>
                                        <span style={isCustom ? styles.badgeCustom : styles.badgePreset}>
                                            {order.TIPO_PEDIDO}
                                        </span>
                                    </div>

                                    <div style={{textAlign: 'right'}}>
                                        <span style={styles.dateText}>
                                            {formatDate(order.FECHA_PEDIDO)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div style={styles.cardBody}>
                                    <div style={styles.imageWrapper}>
                                        <img 
                                            src={imageUrl} 
                                            alt="Producto" 
                                            style={styles.orderImage} 
                                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'}
                                        />
                                    </div>
                                    
                                    <div style={styles.infoWrapper}>
                                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                            <div>
                                                <h4 style={styles.productTitle}>{title}</h4>
                                                <p style={styles.productDesc}>
                                                    {description?.substring(0, 120)}{description && description.length > 120 ? '...' : ''}
                                                </p>
                                            </div>
                                            <div style={{textAlign:'right'}}>
                                                <p style={styles.totalText}>${order.MONTO_TOTAL.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        
                                        <div style={styles.statusFooter}>
                                            <div style={getStatusChipStyle(order.ESTADO_PEDIDO)}>
                                                <span style={{marginRight:'5px'}}>●</span>
                                                {order.ESTADO_PEDIDO}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const getStatusChipStyle = (status: string) => {
    const base = {
        padding: '5px 12px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold' as 'bold',
        display: 'inline-flex', alignItems: 'center'
    };
    
    if (status === 'PENDIENTE') return { ...base, backgroundColor: '#fff3cd', color: '#856404' }; 
    if (status === 'EN PROCESO') return { ...base, backgroundColor: '#cce5ff', color: '#004085' }; 
    if (status === 'ENVIADO') return { ...base, backgroundColor: '#d1ecf1', color: '#0c5460' }; 
    if (status === 'ENTREGADO') return { ...base, backgroundColor: '#d4edda', color: '#155724' }; 
    
    return { ...base, backgroundColor: '#e2e3e5', color: '#383d41' }; 
};

const styles = {
    mainLayout: { minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: "'Segoe UI', sans-serif" },
    content: { padding: '40px 20px', maxWidth: '900px', margin: 'auto' },
    
    pageTitle: { fontSize: '2rem', color: '#2c3e50', marginBottom: '30px', textAlign: 'center' as 'center' },
    
    emptyState: { textAlign: 'center' as 'center', padding: '50px', color: '#7f8c8d' },
    browseButton: { marginTop: '15px', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },

    orderList: { display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },
    
    orderCard: { 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        padding: '25px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
    },

    cardHeader: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '1px solid #f5f5f5',
        paddingBottom: '15px'
    },
    orderTitle: { margin: 0, fontSize: '1.1em', color: '#2c3e50', fontWeight: '700' as '700' },
    
    dateText: { 
        color: '#95a5a6', 
        fontSize: '0.9em',
    },

    badgeCustom: { 
        backgroundColor: '#f3e5f5', color: '#8e44ad', 
        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75em', fontWeight: 'bold' as 'bold', letterSpacing: '0.5px'
    },
    badgePreset: { 
        backgroundColor: '#e1f5fe', color: '#039be5', 
        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75em', fontWeight: 'bold' as 'bold', letterSpacing: '0.5px'
    },

    cardBody: { display: 'flex', gap: '25px' },
    
    imageWrapper: { 
        width: '110px', height: '110px', flexShrink: 0, 
        borderRadius: '8px', overflow: 'hidden' as 'hidden', border: '1px solid #eee'
    },
    orderImage: { width: '100%', height: '100%', objectFit: 'cover' as 'cover' },

    infoWrapper: { flexGrow: 1, display: 'flex', flexDirection: 'column' as 'column', justifyContent: 'space-between' },
    
    productTitle: { margin: '0 0 5px 0', fontSize: '1.2em', fontWeight: '600' as '600', color: '#34495e' },
    productDesc: { margin: 0, fontSize: '0.9em', color: '#7f8c8d', lineHeight: '1.4' },
    totalText: { margin: 0, fontSize: '1.3em', fontWeight: '800' as '800', color: '#2c3e50' },

    statusFooter: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px'
    },
};

export default OrdersPage;