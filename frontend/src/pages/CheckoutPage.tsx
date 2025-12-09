import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const API_PURCHASE_URL = 'http://localhost:3000/api/orders/purchase';

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    CATEGORIA: string;
    PRECIO: number;
    IMAGEN_URL: string;
}

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const preset = location.state?.preset as Preset;

    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });
    
    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (!userString) {
            navigate('/login');
            return;
        }
        if (!preset) {
            navigate('/catalog');
        }
    }, [preset, navigate]);

    const getUserId = () => {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString).id_usuario || JSON.parse(userString).id : null;
    };

    const handleConfirmPurchase = async () => {
        setStatus({ type: '', msg: '' });

        if (!paymentMethod) {
            setStatus({ type: 'error', msg: 'Por favor selecciona un método de pago.' });
            return;
        }

        setIsProcessing(true);
        const userId = getUserId();

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            await axios.post(API_PURCHASE_URL, {
                userId: userId,
                presetId: preset.ID_PRESET,
                totalAmount: preset.PRECIO,
            });

            setStatus({ 
                type: 'success', 
                msg: `¡Pago realizado con éxito! Redirigiendo...` 
            });

            setTimeout(() => {
                navigate('/orders'); 
            }, 2500);

        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Error al procesar la compra.";
            setStatus({ type: 'error', msg: errorMsg });
            setIsProcessing(false);
        }
    };

    if (!preset) return null; 

    return (
        <div style={styles.mainLayout}>
            <Header />
            <div style={styles.content}>
                
                <div style={styles.headerSection}>
                    <h1 style={styles.pageTitle}>Finalizar Compra</h1>
                    <div style={styles.secureBadge}>🔒 Checkout Seguro SSL</div>
                </div>

                <div style={styles.checkoutContainer}>
                    
                    {/* IZQUIERDA: RESUMEN DEL PRODUCTO */}
                    <div style={styles.leftColumn}>
                        <h2 style={styles.columnTitle}>Resumen del Pedido</h2>
                        <div style={styles.productCard}>
                            <img 
                                src={`http://localhost:3000${preset.IMAGEN_URL}`} 
                                alt={preset.NOMBRE} 
                                style={styles.productImage} 
                            />
                            <div style={styles.productInfo}>
                                <div>
                                    <h3 style={styles.productName}>{preset.NOMBRE}</h3>
                                    <span style={styles.categoryTag}>{preset.CATEGORIA}</span>
                                    <p style={styles.description}>{preset.DESCRIPCION}</p>
                                </div>
                                <div style={styles.totalRow}>
                                    <span>Total a Pagar:</span>
                                    <span style={styles.totalPrice}>${preset.PRECIO.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DERECHA: PAGO */}
                    <div style={styles.rightColumn}>
                        <h2 style={styles.columnTitle}>Método de Pago</h2>
                        <p style={{fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '20px'}}>
                            Selecciona cómo quieres pagar tu preset:
                        </p>

                        <div style={styles.paymentMethods}>
                            {/* Opción 1 */}
                            <div 
                                style={paymentMethod === 'paypal' ? styles.methodCardSelected : styles.methodCard}
                                onClick={() => setPaymentMethod('paypal')}
                            >
                                <div style={styles.radioOuter}>
                                    {paymentMethod === 'paypal' && <div style={styles.radioInner} />}
                                </div>
                                <span style={styles.methodIcon}>🅿️</span>
                                <span style={styles.methodName}>PayPal</span>
                            </div>

                            {/* Opción 2 */}
                            <div 
                                style={paymentMethod === 'mercadopago' ? styles.methodCardSelected : styles.methodCard}
                                onClick={() => setPaymentMethod('mercadopago')}
                            >
                                <div style={styles.radioOuter}>
                                    {paymentMethod === 'mercadopago' && <div style={styles.radioInner} />}
                                </div>
                                <span style={styles.methodIcon}>🤝</span>
                                <span style={styles.methodName}>Mercado Pago</span>
                            </div>

                            {/* Opción 3 */}
                            <div 
                                style={paymentMethod === 'visa' ? styles.methodCardSelected : styles.methodCard}
                                onClick={() => setPaymentMethod('visa')}
                            >
                                <div style={styles.radioOuter}>
                                    {paymentMethod === 'visa' && <div style={styles.radioInner} />}
                                </div>
                                <span style={styles.methodIcon}>💳</span>
                                <span style={styles.methodName}>Tarjeta Débito/Crédito</span>
                            </div>
                        </div>

                        {/* Mensaje de Estado */}
                        {status.msg && (
                            <div style={{
                                ...styles.statusBox,
                                backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                                color: status.type === 'success' ? '#155724' : '#721c24',
                                borderColor: status.type === 'success' ? '#c3e6cb' : '#f5c6cb'
                            }}>
                                {status.type === 'success' ? '✅ ' : '⚠️ '}
                                {status.msg}
                            </div>
                        )}

                        <button 
                            onClick={handleConfirmPurchase}
                            disabled={!paymentMethod || isProcessing || status.type === 'success'}
                            style={!paymentMethod || isProcessing || status.type === 'success' ? styles.payButtonDisabled : styles.payButton}
                        >
                            {isProcessing ? 'Procesando...' : `Pagar $${preset.PRECIO.toFixed(2)}`}
                        </button>
                        
                        <p style={styles.footerNote}>Al pagar, aceptas nuestros términos y condiciones.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

// 🎨 ESTILOS PREMIUM
const styles = {
    mainLayout: { 
        minHeight: '100vh', 
        backgroundColor: '#f4f7f6', 
        fontFamily: "'Segoe UI', sans-serif" 
    },
    content: { 
        padding: '40px 20px', 
        maxWidth: '1100px', 
        margin: '0 auto' 
    },
    
    // Header de Página
    headerSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '20px'
    },
    pageTitle: { 
        fontSize: '1.8rem', 
        color: '#2c3e50', 
        margin: 0 
    },
    secureBadge: {
        fontSize: '0.9rem',
        color: '#27ae60',
        backgroundColor: '#e8f8f5',
        padding: '5px 12px',
        borderRadius: '20px',
        fontWeight: '600' as '600',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    },

    checkoutContainer: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr', // La columna izquierda es un poco más ancha
        gap: '30px',
        alignItems: 'start',
    },

    // COLUMNA IZQUIERDA
    leftColumn: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
    },
    columnTitle: {
        fontSize: '1.2rem',
        color: '#34495e',
        marginBottom: '20px',
        fontWeight: '700' as '700'
    },
    productCard: {
        display: 'flex',
        gap: '20px',
    },
    productImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover' as 'cover',
        borderRadius: '8px',
        border: '1px solid #eee'
    },
    productInfo: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'space-between'
    },
    productName: {
        fontSize: '1.4rem',
        margin: '0 0 5px 0',
        color: '#2c3e50'
    },
    categoryTag: {
        backgroundColor: '#f0f3f4',
        color: '#7f8c8d',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        textTransform: 'uppercase' as 'uppercase',
        fontWeight: 'bold' as 'bold',
        display: 'inline-block',
        marginBottom: '10px'
    },
    description: {
        color: '#7f8c8d',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        margin: 0
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '1px dashed #e0e0e0'
    },
    totalPrice: {
        fontSize: '1.6rem',
        fontWeight: '800' as '800',
        color: '#2c3e50'
    },

    // COLUMNA DERECHA
    rightColumn: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
    },
    paymentMethods: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '15px',
        marginBottom: '25px'
    },
    
    // TARJETAS DE MÉTODO DE PAGO
    methodCard: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        border: '2px solid #ecf0f1',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: '#fff'
    },
    methodCardSelected: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px',
        border: '2px solid #3498db', // Borde azul activo
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: '#fdfefe', // Fondo muy sutil
        boxShadow: '0 2px 5px rgba(52, 152, 219, 0.1)'
    },
    radioOuter: {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        border: '2px solid #bdc3c7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '15px'
    },
    radioInner: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#3498db'
    },
    methodIcon: {
        fontSize: '1.5rem',
        marginRight: '15px'
    },
    methodName: {
        fontSize: '1rem',
        fontWeight: '600' as '600',
        color: '#34495e'
    },

    // Feedback y Botones
    statusBox: {
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '0.9rem',
        fontWeight: '600' as '600',
        textAlign: 'center' as 'center',
        border: '1px solid'
    },
    payButton: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold' as 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)',
        transition: 'background 0.2s'
    },
    payButtonDisabled: {
        width: '100%',
        padding: '15px',
        backgroundColor: '#bdc3c7',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold' as 'bold',
        cursor: 'not-allowed'
    },
    footerNote: {
        fontSize: '0.8rem',
        color: '#95a5a6',
        textAlign: 'center' as 'center',
        marginTop: '15px'
    }
};

export default CheckoutPage;