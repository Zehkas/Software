import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const API_URL = 'http://localhost:3000/api/presets'; 

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    PRECIO: number;
    IMAGEN_URL: string;
    ESTADO: number; 
}

const HomePage: React.FC = () => {
    const [randomPresets, setRandomPresets] = useState<Preset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchRandomPresets = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            
            const activePresets = response.data.filter((p: Preset) => p.ESTADO === 1);
            const count = activePresets.length;
            
            if (count > 0) {
                const getRandomIndex = () => Math.floor(Math.random() * count);
                let selected = [];
                let index1 = getRandomIndex();
                selected.push(activePresets[index1]);

                if (count > 1) {
                    let index2;
                    do {
                        index2 = getRandomIndex();
                    } while (index2 === index1);
                    selected.push(activePresets[index2]);
                }
                
                setRandomPresets(selected);
            }
            setError('');
        } catch (err) {
            console.error('Error fetching presets:', err);
            setError('Error al cargar la previsualización de productos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomPresets();
    }, []);

    const handleViewMore = () => {
        navigate('/catalog');
    };

    const handleCreateCustom = () => {
        navigate('/custom-order');
    };

    const handleBuy = (preset: Preset) => {
        navigate('/checkout', { state: { preset } });
    };

    if (loading) return <div style={styles.loading}>Cargando...</div>;
    if (error) return <div style={{...styles.loading, color: 'red'}}>{error}</div>;

    return (
        <div style={styles.mainLayout}>
            <Header /> 

            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Variedad de stickers a tu alcance</h1>
                    <p style={styles.heroSubtitle}>Explora uno de nuestros presets o crea uno único.</p>
                    
                    <div style={styles.heroButtonsContainer}>
                        <button onClick={handleViewMore} style={styles.heroButton}>
                            Explorar Catálogo
                        </button>
                        
                        <button onClick={handleCreateCustom} style={styles.heroButtonCustom}>
                            Pedido de Sticker Custom 🎨
                        </button>
                    </div>
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.sectionTitle}>Algunos de nuestros Presets</h2>
                
                {randomPresets.length === 0 ? (
                    <p style={styles.noPresetsMessage}>Próximamente nuevos estilos increíbles.</p>
                ) : (
                    <div style={styles.previewContainer}>
                        {randomPresets.map((preset) => (
                            <div key={preset.ID_PRESET} style={styles.presetCard}>
                                <div style={styles.imageContainer}>
                                    <img 
                                        src={`http://localhost:3000${preset.IMAGEN_URL}`} 
                                        alt={preset.NOMBRE} 
                                        style={styles.presetImage} 
                                    />
                                </div>
                                <div style={styles.cardDetails}>
                                    <h4 style={styles.presetName}>{preset.NOMBRE}</h4>
                                    <p style={styles.presetDesc}>{preset.DESCRIPCION.substring(0, 60)}...</p>
                                    
                                    <div style={styles.cardFooter}>
                                        <span style={styles.price}>${preset.PRECIO}</span>
                                        <button onClick={() => handleBuy(preset)} style={styles.buyButton}>
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div style={styles.buttonWrapper}>
                    <button onClick={handleViewMore} style={styles.viewMoreButton}>
                        Ver Todos los Productos
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    mainLayout: { minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
    loading: { textAlign: 'center' as 'center', padding: '50px', fontSize: '1.2em', color: '#555' },
    content: { padding: '40px 20px', maxWidth: '1200px', margin: 'auto' },
    
    heroSection: {
        backgroundColor: '#1e272e',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center' as 'center',
        marginBottom: '40px',
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://source.unsplash.com/random/1600x900/?art,graffiti")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    heroContent: { maxWidth: '800px', margin: '0 auto' },
    heroTitle: { fontSize: '3em', marginBottom: '15px', fontWeight: 'bold' as 'bold' },
    heroSubtitle: { fontSize: '1.3em', marginBottom: '30px', color: '#ddd' },
    
    heroButtonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap' as 'wrap',
    },
    heroButton: {
        padding: '12px 30px',
        fontSize: '18px',
        fontWeight: 'bold' as 'bold',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 15px rgba(52, 152, 219, 0.4)',
    },
    heroButtonCustom: {
        padding: '12px 30px',
        fontSize: '18px',
        fontWeight: 'bold' as 'bold',
        backgroundColor: '#9b59b6ff',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)',
    },

    sectionTitle: { textAlign: 'center' as 'center', fontSize: '2em', marginBottom: '40px', color: '#2c3e50' },
    noPresetsMessage: { textAlign: 'center' as 'center', color: '#7f8c8d', fontSize: '1.2em' },

    previewContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        flexWrap: 'wrap' as 'wrap',
    },
    presetCard: {
        width: '320px',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s ease',
    },
    imageContainer: { position: 'relative' as 'relative', height: '220px' },
    presetImage: { width: '100%', height: '100%', objectFit: 'cover' as 'cover' },
    
    cardDetails: { padding: '20px' },
    presetName: { fontSize: '1.4em', margin: '0 0 10px 0', color: '#2c3e50' },
    presetDesc: { color: '#7f8c8d', fontSize: '0.95em', marginBottom: '20px', lineHeight: '1.5' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    price: { fontSize: '1.5em', fontWeight: 'bold' as 'bold', color: '#2c3e50' },
    buyButton: {
        padding: '10px 20px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold' as 'bold',
        transition: 'background 0.3s',
    },

    buttonWrapper: { textAlign: 'center' as 'center', marginTop: '60px' },
    viewMoreButton: {
        padding: '12px 30px',
        fontSize: '16px',
        fontWeight: '600' as '600',
        backgroundColor: 'transparent',
        color: '#3498db',
        border: '2px solid #3498db',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s',
    }
};

export default HomePage;