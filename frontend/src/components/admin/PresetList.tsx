import React, { useState, useEffect } from 'react';
import axios from 'axios';


const API_URL = 'http://localhost:3000/api/presets';

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    CATEGORIA: string;
    PRECIO: number;
    IMAGEN_URL: string;
    ESTADO: number; // 1 = Activo, 0 = Inactivo
}

interface Props {
    onEdit: (preset: Preset) => void;
}

const PresetList: React.FC<Props> = ({ onEdit }) => {
    const [presets, setPresets] = useState<Preset[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPresets = async () => {
        try {
            const response = await axios.get(API_URL);
            setPresets(response.data);
        } catch (error) {
            alert("Error al cargar presets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPresets();
    }, []);

    if (loading) return <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>Cargando datos...</div>;

    return (
        <div style={styles.tableResponsive}>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeaderRow}>
                        <th style={styles.th}>Imagen</th>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Categoría</th>
                        <th style={styles.th}>Precio</th>
                        <th style={styles.th}>Estado</th>
                        <th style={styles.thActions}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {presets.map((preset) => (
                        <tr key={preset.ID_PRESET} style={styles.tableRow}>
                            <td style={styles.td}>
                                <img 
                                    src={`http://localhost:3000${preset.IMAGEN_URL}`} 
                                    alt="mini" 
                                    style={styles.thumbnail}
                                />
                            </td>
                            <td style={styles.td}>
                                <div style={styles.nameText}>{preset.NOMBRE}</div>
                                <div style={styles.descText}>{preset.DESCRIPCION.substring(0, 30)}...</div>
                            </td>
                            <td style={styles.td}>
                                <span style={styles.categoryTag}>{preset.CATEGORIA}</span>
                            </td>
                            <td style={styles.tdPrice}>${preset.PRECIO.toFixed(2)}</td>
                            <td style={styles.td}>
                                <span style={preset.ESTADO === 1 ? styles.statusActive : styles.statusInactive}>
                                    {preset.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td style={styles.tdActions}>
                                <button 
                                    type="button" 
                                    onClick={() => onEdit(preset)} 
                                    style={styles.editBtn}
                                    title="Editar detalles o cambiar estado"
                                >
                                    ✏️ Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {presets.length === 0 && (
                <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                    No hay presets creados aún.
                </div>
            )}
        </div>
    );
};

const styles = {
    tableResponsive: {
        overflowX: 'auto' as 'auto',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse' as 'collapse', 
        minWidth: '700px',
        backgroundColor: 'white'
    },
    tableHeaderRow: { 
        backgroundColor: '#f9fafb', 
        borderBottom: '2px solid #e5e7eb' 
    },
    th: { 
        padding: '16px', 
        textAlign: 'left' as 'left', 
        color: '#6b7280', 
        fontSize: '0.75rem', 
        fontWeight: '700' as '700', 
        textTransform: 'uppercase' as 'uppercase', 
        letterSpacing: '0.05em' 
    },
    thActions: {
        padding: '16px', 
        textAlign: 'right' as 'right', 
        color: '#6b7280', 
        fontSize: '0.75rem', 
        fontWeight: '700' as '700', 
        textTransform: 'uppercase' as 'uppercase', 
        letterSpacing: '0.05em'
    },
    tableRow: { 
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.15s'
    },
    td: { 
        padding: '14px 16px', 
        verticalAlign: 'middle', 
        color: '#374151', 
        fontSize: '0.9rem' 
    },
    tdPrice: {
        padding: '14px 16px', 
        verticalAlign: 'middle', 
        fontWeight: '600' as '600',
        color: '#059669' 
    },
    tdActions: {
        padding: '14px 16px', 
        verticalAlign: 'middle', 
        textAlign: 'right' as 'right',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px'
    },

    thumbnail: {
        width: '50px',
        height: '50px',
        borderRadius: '6px',
        objectFit: 'cover' as 'cover',
        border: '1px solid #eee'
    },
    nameText: { fontWeight: '600' as '600', color: '#111827' },
    descText: { fontSize: '0.8rem', color: '#9ca3af' },
    
    categoryTag: {
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: '500' as '500'
    },

    statusActive: {
        backgroundColor: '#dcfce7', color: '#15803d',
        padding: '4px 10px', borderRadius: '20px',
        fontSize: '0.75rem', fontWeight: 'bold' as 'bold',
        border: '1px solid #bbf7d0',
        display: 'inline-block'
    },
    statusInactive: {
        backgroundColor: '#fee2e2', color: '#b91c1c',
        padding: '4px 10px', borderRadius: '20px',
        fontSize: '0.75rem', fontWeight: 'bold' as 'bold',
        border: '1px solid #fecaca',
        display: 'inline-block'
    },

    editBtn: {
        padding: '6px 12px',
        backgroundColor: '#eff6ff',
        color: '#2563eb',
        border: '1px solid #bfdbfe',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: '500' as '500',
        transition: 'all 0.2s'
    }
};

export default PresetList;