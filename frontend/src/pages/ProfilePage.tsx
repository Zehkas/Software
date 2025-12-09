import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const API_PASSWORD_URL = 'http://localhost:3000/api/users/password'; 

interface UserProfile {
    id_usuario: number; 
    email: string;
    nombre: string;
    apellido: string;
    rol: 0 | 1;
}

const getStoredUser = (): UserProfile | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            return {
                ...user,
                id_usuario: user.id || user.id_usuario || 0 
            } as UserProfile;
        } catch(e) {
            return null;
        }
    }
    return null;
};

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    const [oldPassword, setOldPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = getStoredUser();
        if (loggedInUser && loggedInUser.id_usuario > 0) {
            setUser(loggedInUser);
        } else {
            console.error("No hay sesión activa o ID inválido. Redirigiendo.");
             navigate('/login');
        }
    }, [navigate]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        
        if (!user || !user.id_usuario || user.id_usuario <= 0) {
            setIsError(true);
            setMessage('Error de sesión. El ID de usuario no es válido.');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setIsError(true);
            setMessage('Error: Las contraseñas nuevas no coinciden.');
            return;
        }
        if (!oldPassword || !newPassword || !confirmPassword) {
            setIsError(true);
            setMessage('Error: Todos los campos son obligatorios.');
            return;
        }

        try {
            const response = await axios.put(API_PASSWORD_URL, {
                userId: user.id_usuario,
                oldPassword: oldPassword, 
                newPassword: newPassword,
            });

            setIsError(false);
            setMessage("¡Éxito! Contraseña actualizada correctamente. ✔️");
            
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            setTimeout(() => {
                setIsChangingPassword(false); 
                setMessage('');
            }, 2500); 

        } catch (error: any) {
            setIsError(true);
            const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor.';
            setMessage(`Error: ${errorMessage}`);
        }
    };

    if (!user) {
        return <div style={{textAlign: 'center', marginTop: '50px', backgroundColor: '#f0f2f5', minHeight: '100vh'}}>
                {message ? <p style={{color: 'red', fontSize: '1.2em'}}>{message}</p> : "Cargando perfil..."}
            </div>;
    }

    return (
        <div style={styles.mainLayout}>
            <Header /> 

            <div style={styles.content}> 
                <div style={styles.contentCard}> 
                    <h1>Perfil de Usuario</h1>
                    
                    <div style={styles.profileContainer}>
                        <h2 style={styles.sectionHeader}>Información de Cuenta</h2>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nombre Completo:</label>
                            <input 
                                type="text" 
                                defaultValue={`${user.nombre} ${user.apellido}`} 
                                style={styles.inputDisabled} 
                                disabled
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email:</label>
                            <input 
                                type="email" 
                                defaultValue={user.email} 
                                style={styles.inputDisabled} 
                                disabled
                            />
                        </div>

                        <h2 style={styles.sectionHeader}>Seguridad</h2>
                        <button 
                            onClick={() => {
                                setIsChangingPassword(!isChangingPassword);
                                setMessage('');
                                setIsError(false);
                            }}
                            style={isChangingPassword ? styles.cancelButton : styles.changePasswordButton}
                        >
                            {isChangingPassword ? 'Cancelar Cambio' : 'Cambiar Contraseña'}
                        </button>
                        
                        {isChangingPassword && (
                            <form onSubmit={handleChangePassword} style={styles.passwordForm}>
                                {message && (
                                    <div style={{ 
                                        ...styles.messageBox, 
                                        backgroundColor: isError ? '#ffebee' : '#e8f5e9', 
                                        color: isError ? '#c62828' : '#2e7d32', 
                                        borderColor: isError ? '#ef9a9a' : '#a5d6a7'
                                    }}>
                                        {message}
                                    </div>
                                )}
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Contraseña Actual:</label>
                                    <input 
                                        type="password" 
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        style={styles.input} 
                                        required
                                        placeholder="Ingresa tu contraseña actual"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nueva Contraseña:</label>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={styles.input} 
                                        required
                                        placeholder="Escribe la nueva contraseña"
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirmar Nueva:</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={styles.input} 
                                        required
                                        placeholder="Repite la nueva contraseña"
                                    />
                                </div>
                                
                                <button type="submit" style={styles.updateButton}>
                                    Guardar Nueva Contraseña
                                </button>
                            </form>
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
        backgroundColor: '#f8f8f8', 
        width: '100%',
    },
    content: { 
        padding: '20px', 
        width: '100%', 
        display: 'flex',
        justifyContent: 'center', 
    },
    contentCard: { 
        padding: '30px', 
        maxWidth: '800px', 
        margin: '20px 0', 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
        width: '100%',
    },
    profileContainer: { 
        padding: '10px' 
    },
    sectionHeader: { 
        borderBottom: '2px solid #f0f0f0', 
        paddingBottom: '10px', 
        marginTop: '30px',
        color: '#2c3e50',
        fontSize: '1.2em'
    },
    inputGroup: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        margin: '20px 0',
        flexWrap: 'wrap' as 'wrap' 
    },
    label: { 
        flexShrink: 0, 
        width: '150px', 
        fontWeight: '600' as '600',
        color: '#555'
    },
    input: { 
        padding: '10px', 
        flexGrow: 1, 
        border: '1px solid #ccc', 
        borderRadius: '4px',
        fontSize: '16px'
    },
    inputDisabled: {
        padding: '10px', 
        flexGrow: 1, 
        border: '1px solid #eee', 
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        color: '#777',
        fontSize: '16px'
    },
    changePasswordButton: {
        padding: '10px 20px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '14px',
        transition: 'background 0.3s'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#95a5a6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '14px'
    },
    passwordForm: {
        padding: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        marginTop: '20px',
        backgroundColor: '#fafafa'
    },
    updateButton: { 
        marginTop: '10px', 
        padding: '12px 25px', 
        backgroundColor: '#27ae60', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer', 
        fontSize: '16px',
        fontWeight: 'bold' as 'bold',
        width: '100%'
    },
    messageBox: {
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid',
        textAlign: 'center' as 'center',
        fontWeight: 'bold' as 'bold'
    }
};

export default ProfilePage;