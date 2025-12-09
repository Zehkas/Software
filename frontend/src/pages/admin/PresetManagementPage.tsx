import React, { useState } from 'react';
import Header from '../../components/Header';
import PresetForm from '../../components/admin/PresetForm'; 
import PresetList from '../../components/admin/PresetList'; 

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    CATEGORIA: string;
    PRECIO: number;
    IMAGEN_URL: string;
    ESTADO: number; 
}

const PresetManagementPage: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'create'>('list');
    const [editingPreset, setEditingPreset] = useState<Preset | null>(null);

    const handleEditPreset = (preset: Preset) => {
        setEditingPreset(preset);
        setCurrentView('create'); 
    };

    const handleCancelEdit = () => {
        setEditingPreset(null); 
        setCurrentView('list'); 
    };
    
    const handleSuccess = () => {
        setEditingPreset(null); 
        setCurrentView('list'); 
    };


    const isEditing = !!editingPreset;
    const createTabLabel = isEditing ? `✏️ Editando: ${editingPreset.NOMBRE}` : '➕ Nuevo Preset';

    return (
        <div style={styles.mainLayout}>
            <Header /> 

            <div style={styles.content}>
                
                <div style={styles.headerSection}>
                    <h1 style={styles.title}>Gestión de Catálogo 🎨</h1>
                    <p style={styles.subtitle}>Administra los productos, precios y disponibilidad.</p>
                </div>
                
                <div style={styles.mainCard}>
                    
                    <div style={styles.tabBar}>
                        <button 
                            onClick={() => { setCurrentView('list'); setEditingPreset(null); }} 
                            style={currentView === 'list' ? styles.activeTab : styles.tab}
                        >
                            📋 Listado de Presets
                        </button>
                        
                        <button 
                            onClick={() => setCurrentView('create')} 
                            style={{
                                ...(currentView === 'create' ? styles.activeTab : styles.tab),
                                ...(isEditing && currentView === 'create' ? styles.activeTabEditing : {})
                            }}
                            disabled={isEditing && currentView === 'list'}
                        >
                            {createTabLabel}
                        </button>
                    </div>
                    
                    <div style={styles.viewContainer}>
                        {currentView === 'list' ? (
                            <PresetList 
                                onEdit={handleEditPreset} 
                            />
                        ) : (
                            <div style={styles.formWrapper}>
                                <PresetForm 
                                    presetToEdit={editingPreset} 
                                    onCancelEdit={handleCancelEdit}
                                    onSuccess={handleSuccess}
                                />
                            </div>
                        )}
                    </div>

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
    
    headerSection: { 
        marginBottom: '30px',
        textAlign: 'left' as 'left'
    },
    title: { 
        color: '#1f2937', 
        fontSize: '2rem', 
        marginBottom: '5px', 
        fontWeight: '800' as '800' 
    },
    subtitle: { 
        color: '#6b7280', 
        fontSize: '1rem' 
    },

    mainCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        border: '1px solid #e5e7eb'
    },

    tabBar: { 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
    },
    tab: { 
        padding: '16px 24px', 
        cursor: 'pointer', 
        border: 'none', 
        backgroundColor: 'transparent', 
        fontSize: '0.95rem',
        color: '#6b7280',
        fontWeight: '500' as '500',
        transition: 'all 0.2s ease',
        borderBottom: '3px solid transparent'
    },
    activeTab: { 
        padding: '16px 24px', 
        cursor: 'pointer', 
        border: 'none', 
        backgroundColor: 'white', 
        fontSize: '0.95rem',
        color: '#2563eb',
        fontWeight: '700' as '700',
        borderBottom: '3px solid #2563eb',
        borderRight: '1px solid #f3f4f6'
    },
    activeTabEditing: {
        color: '#d97706',
        borderBottom: '3px solid #d97706',
    },

    viewContainer: { 
        padding: '30px',
        backgroundColor: 'white',
        minHeight: '400px' 
    },
    
    formWrapper: {
        maxWidth: '700px',
        margin: '0 auto'
    }
};

export default PresetManagementPage;