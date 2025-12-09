const userModel = require('../models/userModel');
const { openConnection } = require('../config/db');

exports.register = async (req, res) => {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        await userModel.createUser({ nombre, apellido,   email, password });
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        if (error.errorNum === 1) {
            return res.status(400).json({ message: "El email ya está en uso" });
        }
        res.status(500).json({ message: "Error en el servidor" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son obligatorios." });
    }

    try {
        const user = await userModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        
        if (user.PASSWORD !== password) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }
        
        const userRol = Number(user.ROL);
        res.status(200).json({
            message: `Bienvenido(a). Sesión iniciada.`,
            user: {
                id: user.ID_USUARIO,
                nombre: user.NOMBRE,
                apellido: user.APELLIDO,
                email: user.EMAIL,
                rol: userRol 
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};