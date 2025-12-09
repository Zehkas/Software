import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

const AdminDashboard: React.FC = () => {
    return (
        <div style={styles.mainLayout}>
            <Header />
            <div style={styles.content}>
                
                <div style={styles.headerSection}>
                    <h1 style={styles.title}>Panel de Administración</h1>
                    <p style={styles.subtitle}>
                        Bienvenido al centro de control. Selecciona un módulo para comenzar.
                    </p>
                </div>

                <div style={styles.gridContainer}>
                    
                    <Link to="/admin/presets" style={styles.dashboardCard}>
                        <div style={styles.iconContainer}>
                            🖼️
                        </div>
                        <h3 style={styles.cardTitle}>Gestión de Presets</h3>
                        <p style={styles.cardDesc}>
                            Administra el catálogo: Agrega, edita o elimina productos y controla su visibilidad.
                        </p>
                    </Link>

                    <Link to="/admin/pedidos" style={styles.dashboardCard}>
                        <div style={{...styles.iconContainer, backgroundColor: '#e8f6f3'}}>
                            📦
                        </div>
                        <h3 style={styles.cardTitle}>Pedidos y Archivos</h3>
                        <p style={styles.cardDesc}>
                            Revisa el historial de compras, actualiza estados y descarga archivos custom.
                        </p>
                    </Link>

                </div>
            </div>
        </div>
    );
};

const styles = {
    mainLayout: { 
        minHeight: '100vh', 
        backgroundColor: '#f0f2f5',
        fontFamily: "'Segoe UI', sans-serif"
    },
    content: { 
        padding: '60px 20px', 
        maxWidth: '1000px', 
        margin: 'auto' 
    },
    
    headerSection: {
        textAlign: 'center' as 'center',
        marginBottom: '60px'
    },
    title: { 
        color: '#2c3e50', 
        fontSize: '2.5rem', 
        marginBottom: '15px',
        fontWeight: '800' as '800'
    },
    subtitle: { 
        color: '#7f8c8d', 
        fontSize: '1.2rem',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.5'
    },

    gridContainer: { 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        padding: '0 20px'
    },

    dashboardCard: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px 30px',
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        border: '1px solid #ffffff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        textAlign: 'center' as 'center',
        cursor: 'pointer',
        position: 'relative' as 'relative',
    },
    
    iconContainer: {
        width: '80px',
        height: '80px',
        backgroundColor: '#ebf5fb',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    
    cardTitle: {
        color: '#2c3e50',
        fontSize: '1.5rem',
        fontWeight: '700' as '700',
        margin: '0 0 10px 0'
    },
    
    cardDesc: {
        color: '#95a5a6',
        fontSize: '1rem',
        lineHeight: '1.6',
        marginBottom: '20px'
    },

    rfTag: {
        marginTop: 'auto',
        fontSize: '0.8rem',
        color: '#bdc3c7',
        fontWeight: 'bold' as 'bold',
        textTransform: 'uppercase' as 'uppercase',
        letterSpacing: '1px',
        border: '1px solid #ecf0f1',
        padding: '5px 10px',
        borderRadius: '20px'
    }
};

export default AdminDashboard;