import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Preset {
    ID_PRESET: number;
    NOMBRE: string;
    DESCRIPCION: string;
    CATEGORIA: string;
    PRECIO: number;
    IMAGEN_URL: string;
    ESTADO: number; 
}

interface PresetFormProps {
    presetToEdit: Preset | null;
    onCancelEdit: () => void;
    onSuccess: () => void;
}

const API_URL = 'http://localhost:3000/api/presets';

const PresetForm: React.FC<PresetFormProps> = ({ presetToEdit, onCancelEdit, onSuccess }) => {
    const isEditMode = presetToEdit !== null;

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: 0,
        estado: 1
    });
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState('');

    useEffect(() => {
        if (isEditMode && presetToEdit) {
            setFormData({
                nombre: presetToEdit.NOMBRE,
                descripcion: presetToEdit.DESCRIPCION,
                categoria: presetToEdit.CATEGORIA,
                precio: presetToEdit.PRECIO,
                estado: presetToEdit.ESTADO 
            });
            setCurrentImageUrl(presetToEdit.IMAGEN_URL);
            setMessage(''); 
            setFile(null); 
        } else {
            setFormData({ nombre: '', descripcion: '', categoria: '', precio: 0, estado: 1 });
            setCurrentImageUrl('');
            setMessage('');
            setFile(null);
        }
    }, [presetToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: (type === 'number' || name === 'estado') ? Number(value) : value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Procesando solicitud...');

        try {
            const data = new FormData();
            data.append('nombre', formData.nombre);
            data.append('descripcion', formData.descripcion);
            data.append('categoria', formData.categoria);
            data.append('precio', String(formData.precio));
            data.append('estado', String(formData.estado));

            if (file) {
                data.append('presetImage', file); 
            } else if (isEditMode) {
                data.append('current_imagen_url', currentImageUrl);
            }
            
            let response;
            if (isEditMode && presetToEdit) {
                response = await axios.put(`${API_URL}/${presetToEdit.ID_PRESET}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                response = await axios.post(API_URL, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setMessage(response.data.message || 'Operación exitosa.');
            
            setTimeout(() => {
                onSuccess();
            }, 1000);

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Error al procesar la solicitud.';
            setMessage(`ERROR: ${errorMessage}`);
        }
    };

    return (
        <div style={styles.cardContainer}>
            <div style={styles.header}>
                <h2 style={styles.title}>
                    {isEditMode ? '✏️ Editar Preset' : '✨ Crear Nuevo Preset'}
                </h2>
                <p style={styles.subtitle}>
                    {isEditMode ? 'Modifica los detalles del producto seleccionado.' : 'Ingresa la información para añadir un producto al catálogo.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                
                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Nombre del Producto</label>
                    <input 
                        type="text" 
                        name="nombre" 
                        value={formData.nombre} 
                        onChange={handleChange} 
                        style={styles.input} 
                        placeholder="Ej: Cyberpunk Pack"
                        required 
                    />
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Descripción</label>
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleChange} 
                        style={styles.textarea} 
                        placeholder="Describe los detalles del preset..."
                        required 
                    />
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Categoría</label>
                    <input 
                        type="text" 
                        name="categoria" 
                        value={formData.categoria} 
                        onChange={handleChange} 
                        style={styles.input} 
                        placeholder="Ej: Retrato, Paisaje, Urbano..."
                        required 
                    />
                </div>

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Precio (CLP)</label>
                    <input 
                        type="number" 
                        name="precio" 
                        value={formData.precio} 
                        onChange={handleChange} 
                        style={styles.input} 
                        min="0" 
                        step="0.01" 
                        required 
                    />
                </div>

                {isEditMode && (
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Estado</label>
                        <select 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange} 
                            style={styles.select}
                        >
                            <option value={1}>🟢 Activo</option>
                            <option value={0}>🔴 Inactivo</option>
                        </select>
                    </div>
                )}

                <div style={styles.fieldGroup}>
                    <label style={styles.label}>Imagen del Producto</label>
                    
                    <div style={styles.imageUploadBox}>
                        {isEditMode && currentImageUrl && !file && (
                            <div style={styles.previewContainer}>
                                <img 
                                    src={`http://localhost:3000${currentImageUrl}`} 
                                    alt="Actual" 
                                    style={styles.previewImage}
                                />
                                <span style={styles.previewLabel}>Imagen Actual</span>
                            </div>
                        )}
                        
                        <input
                            type="file"
                            name="presetImage"
                            onChange={handleFileChange}
                            style={styles.fileInput}
                            required={!isEditMode || (isEditMode && !currentImageUrl && !file)} 
                        />
                        <p style={styles.uploadText}>
                            {file ? `Archivo seleccionado: ${file.name}` : "Haz clic o arrastra para seleccionar una imagen"}
                        </p>
                    </div>
                </div>

                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.submitButton}>
                        {isEditMode ? 'Guardar Cambios' : 'Crear Preset'}
                    </button>

                    {isEditMode && (
                        <button type="button" onClick={onCancelEdit} style={styles.cancelButton}>
                            Cancelar
                        </button>
                    )}
                </div>

                {message && (
                    <div style={{
                        ...styles.messageBox,
                        backgroundColor: message.includes('ERROR') ? '#fee2e2' : '#dcfce7',
                        color: message.includes('ERROR') ? '#b91c1c' : '#15803d'
                    }}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

const styles = {
    cardContainer: {
        maxWidth: '100%',
        margin: '0 auto',
        padding: '10px'
    },
    header: {
        marginBottom: '25px',
        textAlign: 'center' as 'center'
    },
    title: {
        fontSize: '1.5rem',
        color: '#1f2937',
        margin: '0 0 5px 0'
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#6b7280'
    },
    
    form: { display: 'flex', flexDirection: 'column' as 'column', gap: '20px' },

    fieldGroup: { display: 'flex', flexDirection: 'column' as 'column', gap: '8px', width: '100%' },

    label: { 
        fontSize: '0.95rem', 
        fontWeight: '600' as '600', 
        color: '#374151' 
    },
    
    input: {
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box' as 'border-box'
    },
    textarea: {
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '1rem',
        minHeight: '100px',
        fontFamily: 'inherit',
        resize: 'vertical' as 'vertical',
        width: '100%',
        boxSizing: 'border-box' as 'border-box'
    },
    select: {
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '1rem',
        backgroundColor: 'white',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box' as 'border-box'
    },


    imageUploadBox: {
        border: '2px dashed #d1d5db',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center' as 'center',
        backgroundColor: '#f9fafb',
        position: 'relative' as 'relative'
    },
    fileInput: {
        opacity: 0,
        position: 'absolute' as 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        cursor: 'pointer'
    },
    uploadText: {
        color: '#6b7280',
        fontSize: '0.9rem',
        marginTop: '10px'
    },
    previewContainer: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        marginBottom: '10px'
    },
    previewImage: {
        height: '80px',
        borderRadius: '4px',
        border: '1px solid #e5e7eb',
        marginBottom: '5px'
    },
    previewLabel: {
        fontSize: '0.75rem',
        color: '#9ca3af'
    },

    buttonGroup: {
        display: 'flex',
        gap: '15px',
        marginTop: '10px'
    },
    submitButton: { 
        flex: 1,
        padding: '12px', 
        backgroundColor: '#2563eb',
        color: 'white', 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '1rem',
        fontWeight: '600' as '600',
        transition: 'background-color 0.2s',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
    },
    cancelButton: { 
        flex: 1,
        padding: '12px', 
        backgroundColor: '#f3f4f6', 
        color: '#4b5563', 
        border: '1px solid #d1d5db', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '1rem',
        fontWeight: '500' as '500',
        transition: 'background-color 0.2s'
    },

    messageBox: {
        padding: '12px',
        borderRadius: '6px',
        fontSize: '0.9rem',
        textAlign: 'center' as 'center',
        fontWeight: '500' as '500'
    }
};

export default PresetForm;