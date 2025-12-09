import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface UserProfile {
    nombre: string;
    rol: 0 | 1;
}

const getSessionInfo = (): { name: string; roleLabel: string; role: 0 | 1 } | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
        try {
            const user: UserProfile = JSON.parse(userString);
            const roleLabel = user.rol === 1 ? 'Admin' : 'Cliente';
            return { name: user.nombre, roleLabel, role: user.rol };
        } catch (e) { return null; }
    }
    return null;
};

const Header: React.FC = () => {
    const [sessionInfo, setSessionInfo] = useState<{ name: string; roleLabel: string; role: 0 | 1 } | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setSessionInfo(getSessionInfo());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setSessionInfo(null);
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                
                <nav style={styles.nav}>
                    <Link to="/home" style={isActive('/home') ? styles.activeLink : styles.link}>
                        Inicio
                    </Link>
                    <Link to="/catalog" style={isActive('/catalog') ? styles.activeLink : styles.link}>
                        Productos
                    </Link>
                    <Link to="/custom-order" style={isActive('/custom-order') ? styles.activeLink : styles.link}>
                        Custom
                    </Link>
                    <Link to="/orders" style={isActive('/orders') ? styles.activeLink : styles.link}>
                        Pedidos
                    </Link>
                    
                    {sessionInfo?.role === 1 && (
                        <Link to="/admin/dashboard" style={styles.adminLink}>
                            Admin Panel 🛡️
                        </Link>
                    )}
                </nav>

                <div style={styles.userSection}>
                    {sessionInfo ? (
                        <>
                            <Link to="/profile" style={styles.profileLink} title="Ir a mi perfil">
                                <div style={styles.avatar}>
                                    {sessionInfo.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={styles.userInfo}>
                                    <span style={styles.userName}>{sessionInfo.name}</span>
                                    <span style={styles.userRole}>{sessionInfo.roleLabel}</span>
                                </div>
                            </Link>
                            
                            <button onClick={handleLogout} style={styles.logoutButton}>
                                Salir
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={styles.loginLink}>Iniciar Sesión</Link>
                    )}
                </div>

            </div>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#1e272e',
        color: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
        position: 'sticky' as 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    nav: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '30px',
        flex: 1,
    },
    link: {
        color: '#b2bec3',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '500' as '500',
        transition: 'color 0.2s ease',
        padding: '5px 0',
    },
    activeLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: 'bold' as 'bold',
        borderBottom: '2px solid #3498db',
        padding: '5px 0',
    },
    adminLink: {
        color: '#f1c40f',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: 'bold' as 'bold',
        border: '1px solid #f1c40f',
        padding: '4px 12px',
        borderRadius: '20px',
        transition: 'all 0.3s',
        marginLeft: '10px',
    },

    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    profileLink: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textDecoration: 'none',
        cursor: 'pointer',
    },
    avatar: {
        width: '38px',
        height: '38px',
        backgroundColor: '#3498db',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold' as 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        lineHeight: '1.2',
    },
    userName: {
        color: 'white',
        fontSize: '0.95rem',
        fontWeight: '600' as '600',
    },
    userRole: {
        color: '#b2bec3',
        fontSize: '0.8rem',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        border: '1px solid #e74c3c',
        color: '#e74c3c',
        padding: '8px 18px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold' as 'bold',
        transition: 'all 0.2s',
    },
    loginLink: {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold' as 'bold',
        fontSize: '1rem',
    }
};

export default Header;