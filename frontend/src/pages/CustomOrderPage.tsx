import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const CustomOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; msg: string }>({ type: '', msg: '' });

    const BASE_PRICE = 2000; 

    const getUserId = () => {
        const userString = localStorage.getItem('user');
        if (!userString) return null;
        try {
            const u = JSON.parse(userString);
            return u.id_usuario || u.id;
        } catch (e) { return null; }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(e.target.files);
    };

    const handleSubmit = async () => {
        setStatus({ type: '', msg: '' });

        const userId = getUserId();
        if (!userId) {
            setStatus({ type: 'error', msg: 'Sesión expirada. Por favor inicia sesión.' });
            return;
        }
        if (!title.trim() || !description.trim()) {
            setStatus({ type: 'error', msg: 'Por favor completa el título y la descripción.' });
            return;
        }
        if (!paymentMethod) {
            setStatus({ type: 'error', msg: 'Debes seleccionar un método de pago.' });
            return;
        }

        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('userId', String(userId));
            formData.append('title', title);
            formData.append('description', description);
            formData.append('total', String(BASE_PRICE));

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    formData.append('refImages', files[i]);
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1500));

            await axios.post('http://localhost:3000/api/orders/custom', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus({ type: 'success', msg: `¡Pago aceptado! Pedido registrado correctamente.` });
            
            setTimeout(() => {
                navigate('/orders');
            }, 2500);

        } catch (error: any) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Hubo un problema al procesar tu solicitud.";
            setStatus({ type: 'error', msg: errorMsg });
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.mainLayout}>
            <Header />
            <div style={styles.content}>
                
                <div style={styles.headerSection}>
                    <h1 style={styles.pageTitle}>Pedido Personalizado 🎨</h1>
                </div>

                <div style={styles.checkoutContainer}>
                    
                    <div style={styles.leftColumn}>
                        <h2 style={styles.columnTitle}>1. Detalles del Proyecto</h2>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Título:</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Descripción:</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Referencias (Imágenes):</label>
                            <div style={styles.fileInputWrapper}>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={styles.fileInput}
                                />
                                <p style={styles.helperText}>Sube hasta 5 imágenes (JPG, PNG)</p>
                            </div>
                        </div>
                    </div>

                    <div style={styles.rightColumn}>
                        <h2 style={styles.columnTitle}>2. Pago y Confirmación</h2>
                        
                        <div style={styles.summaryBox}>
                            <div style={styles.priceRow}>
                                <span>Costo Base:</span>
                                <span style={styles.price}>${BASE_PRICE}</span>
                            </div>
                            <p style={styles.summaryNote}>
                            </p>
                        </div>

                        <h3 style={styles.paymentTitle}>Selecciona Método de Pago:</h3>
                        
                        <div style={styles.paymentMethods}>
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
                            onClick={handleSubmit} 
                            disabled={isProcessing || status.type === 'success'}
                            style={isProcessing || status.type === 'success' ? styles.payButtonDisabled : styles.payButton}
                        >
                            {isProcessing ? 'Procesando...' : `Pagar y Enviar ($${BASE_PRICE})`}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    mainLayout: { minHeight: '100vh', backgroundColor: '#f4f7f6', fontFamily: "'Segoe UI', sans-serif" },
    content: { padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' },
    
    headerSection: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '30px', borderBottom: '1px solid #e0e0e0', paddingBottom: '20px'
    },
    pageTitle: { fontSize: '1.8rem', color: '#2c3e50', margin: 0 },
    secureBadge: {
        fontSize: '0.9rem', color: '#27ae60', backgroundColor: '#e8f8f5',
        padding: '5px 12px', borderRadius: '20px', fontWeight: '600' as '600'
    },

    checkoutContainer: {
        display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start'
    },

    leftColumn: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' },
    columnTitle: { fontSize: '1.2rem', color: '#34495e', marginBottom: '20px', fontWeight: '700' as '700' },
    
    inputGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column' as 'column', gap: '8px' },
    label: { fontWeight: '600' as '600', color: '#555' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
    textarea: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', minHeight: '120px', fontFamily: 'inherit' },
    fileInputWrapper: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px dashed #ccc' },
    fileInput: { width: '100%' },
    helperText: { fontSize: '0.85em', color: '#7f8c8d', marginTop: '8px' },

    rightColumn: { backgroundColor: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' },
    
    summaryBox: { backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e0e0e0' },
    priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.3em', fontWeight: 'bold' as 'bold', color: '#2c3e50' },
    price: { color: '#27ae60' },
    summaryNote: { fontSize: '0.85em', color: '#95a5a6', marginTop: '5px' },

    paymentTitle: { fontSize: '1rem', marginBottom: '15px', color: '#34495e' },
    paymentMethods: { display: 'flex', flexDirection: 'column' as 'column', gap: '15px', marginBottom: '25px' },
    
    methodCard: { display: 'flex', alignItems: 'center', padding: '15px', border: '2px solid #ecf0f1', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease', backgroundColor: '#fff' },
    methodCardSelected: { display: 'flex', alignItems: 'center', padding: '15px', border: '2px solid #3498db', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fdfefe', boxShadow: '0 2px 5px rgba(52, 152, 219, 0.1)' },
    radioOuter: { width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #bdc3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px' },
    radioInner: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3498db' },
    methodIcon: { fontSize: '1.5rem', marginRight: '15px' },
    methodName: { fontSize: '1rem', fontWeight: '600' as '600', color: '#34495e' },

    statusBox: { padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' as '600', textAlign: 'center' as 'center', border: '1px solid' },
    payButton: { width: '100%', padding: '15px', backgroundColor: '#8e44ad', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold' as 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(142, 68, 173, 0.2)', transition: 'background 0.2s' },
    payButtonDisabled: { width: '100%', padding: '15px', backgroundColor: '#bdc3c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold' as 'bold', cursor: 'not-allowed' },
};

export default CustomOrderPage;