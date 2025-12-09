import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/auth/login';

interface UserData {
    id: number;
    email: string;
    nombre: string;
    apellido: string;
    rol: 0 | 1;
}

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await axios.post(API_URL, formData);
            const userData: UserData = response.data.user; 
            const userRole = userData.rol; 

            localStorage.setItem('user', JSON.stringify(userData));

            setMessage('¡Bienvenido de vuelta!');
            
            setTimeout(() => {
                let redirectPath = '/home'; 
                if (userRole === 1) {
                    redirectPath = '/admin/dashboard';
                } else if (userRole === 0) {
                    redirectPath = '/home';
                }
                navigate(redirectPath);
            }, 1000); 

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Credenciales inválidas.';
            setMessage(errorMessage);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                
                <div style={styles.header}>
                    <h2 style={styles.title}>Iniciar Sesión</h2>
                    <p style={styles.subtitle}>Accede a tu cuenta para continuar</p>
                </div>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            style={styles.input}
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer'}}
                        disabled={loading}
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>

                {message && (
                    <div style={{ 
                        ...styles.messageBox, 
                        backgroundColor: isError ? '#ffe6e6' : '#e6fffa', 
                        color: isError ? '#cc0000' : '#006644',
                        borderColor: isError ? '#ffcccc' : '#b3ffe0'
                    }}>
                        {isError ? '⚠️ ' : '👋 '} {message}
                    </div>
                )}
                
                <div style={styles.footer}>
                    <p style={styles.linkText}>
                        ¿Aún no tienes cuenta? {' '}
                        <Link to="/register" style={styles.link}>
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};


const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5', 
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)', 
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box' as 'border-box',
    },
    header: {
        textAlign: 'center' as 'center',
        marginBottom: '30px',
    },
    title: {
        margin: '0 0 10px 0',
        color: '#1a1a1a',
        fontSize: '26px',
        fontWeight: '700',
    },
    subtitle: {
        margin: 0,
        color: '#666666',
        fontSize: '15px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        textAlign: 'left' as 'left',
    },
    label: {
        marginBottom: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #e1e1e1',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#fafafa',
    },
    button: {
        padding: '14px',
        marginTop: '10px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#2563eb', 
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
    },
    messageBox: {
        marginTop: '25px',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '14px',
        textAlign: 'center' as 'center',
        border: '1px solid',
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center' as 'center',
        borderTop: '1px solid #eee',
        paddingTop: '20px',
    },
    linkText: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '600',
        marginLeft: '5px',
    }
};

export default LoginPage;