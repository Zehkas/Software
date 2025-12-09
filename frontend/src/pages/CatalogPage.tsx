import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/presets'; 

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    CATEGORIA: string;
    PRECIO: number;
    IMAGEN_URL: string;
    ESTADO: number; 
}

const CatalogPage: React.FC = () => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchActivePresets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            const activePresets = response.data.filter((p: Preset) => p.ESTADO === 1);
            setPresets(activePresets);
            setError('');
        } catch (err) {
            setError('Error al cargar el catálogo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivePresets();
    }, []);
    
    const handleBuyClick = (preset: Preset) => {
        navigate('/checkout', { state: { preset: preset } });
    };

    if (loading) return <div style={styles.loading}>Cargando catálogo...</div>;
    if (error) return <div style={{...styles.loading, color: 'red'}}>{error}</div>;

    return (
        <div style={styles.mainLayout}>
            <Header /> 

            <div style={styles.content}>
                <div style={styles.headerSection}>
                    <h1 style={styles.title}>Nuestra Colección 🎨</h1>
                    <p style={styles.subtitle}>Encuentra tus stickers favoritos para decorar.</p>
                </div>
                
                {presets.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>No hay productos activos disponibles por el momento.</p>
                    </div>
                ) : (
                    <div style={styles.gridContainer}>
                        {presets.map((preset) => (
                            <div key={preset.ID_PRESET} style={styles.productCard}>
                                <div style={styles.imageContainer}>
                                    <img 
                                        src={`http://localhost:3000${preset.IMAGEN_URL}`} 
                                        alt={preset.NOMBRE} 
                                        style={styles.productImage} 
                                    />
                                    <span style={styles.categoryBadge}>{preset.CATEGORIA}</span>
                                </div>
                                
                                <div style={styles.cardBody}>
                                    <h3 style={styles.productName}>{preset.NOMBRE}</h3>
                                    <p style={styles.productDescription}>
                                        {preset.DESCRIPCION.length > 60 
                                            ? `${preset.DESCRIPCION.substring(0, 60)}...` 
                                            : preset.DESCRIPCION}
                                    </p>
                                    
                                    <div style={styles.cardFooter}>
                                        <span style={styles.price}>${preset.PRECIO}</span>
                                        <button 
                                            onClick={() => handleBuyClick(preset)}
                                            style={styles.buyButton}
                                        >
                                            Comprar Ahora
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    mainLayout: { 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" 
    },
    loading: { 
        textAlign: 'center' as 'center', 
        padding: '80px', 
        fontSize: '1.5rem', 
        color: '#666' 
    },
    content: { 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto' 
    },
    
    headerSection: {
        textAlign: 'center' as 'center',
        marginBottom: '50px',
    },
    title: {
        fontSize: '2.5rem',
        color: '#2c3e50',
        marginBottom: '10px',
        fontWeight: '700' as '700',
    },
    subtitle: {
        fontSize: '1.3rem',
        color: '#7f8c8d',
        fontWeight: '300' as '300',
    },
    emptyState: {
        textAlign: 'center' as 'center',
        padding: '50px',
        color: '#95a5a6',
        fontSize: '1.2rem',
    },

    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '30px',
    },

    productCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    
    imageContainer: {
        position: 'relative' as 'relative',
        height: '200px',
        overflow: 'hidden',
    },
    productImage: { 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover' as 'cover',
        transition: 'transform 0.3s',
    },
    categoryBadge: {
        position: 'absolute' as 'absolute',
        top: '12px',
        right: '12px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600' as '600',
        textTransform: 'uppercase' as 'uppercase',
        letterSpacing: '0.5px',
    },

    cardBody: {
        padding: '20px',
        flexGrow: 1, 
        display: 'flex',
        flexDirection: 'column' as 'column',
    },
    productName: { 
        fontSize: '1.25rem', 
        margin: '0 0 10px 0', 
        color: '#2c3e50',
        fontWeight: '700' as '700',
    },
    productDescription: { 
        color: '#7f8c8d', 
        fontSize: '0.9rem',
        lineHeight: '1.5',
        marginBottom: '20px',
        flexGrow: 1, 
    },

    cardFooter: {
        marginTop: 'auto', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '15px',
        borderTop: '1px solid #f1f1f1',
    },
    price: { 
        fontSize: '1.4rem', 
        fontWeight: '700' as '700', 
        color: '#2c3e50', 
    },
    buyButton: {
        padding: '10px 20px', 
        backgroundColor: '#3498db', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '0.95rem', 
        fontWeight: '600' as '600',
        transition: 'background-color 0.2s',
        boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)',
    }
};

export default CatalogPage;