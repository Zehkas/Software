
const userModel = require('../models/userModel');

exports.updatePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body; 

    console.log("--- INICIO CAMBIO DE CONTRASEÑA ---");
    console.log("Datos recibidos del Frontend:");
    console.log(`   > userId: ${userId} (Tipo: ${typeof userId})`);
    console.log(`   > oldPassword: ${oldPassword}`);
    console.log(`   > newPassword: ${newPassword}`);

    if (!userId || !oldPassword || !newPassword) {
        console.log("ERROR: Faltan campos.");
        return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    try {
        console.log(`Buscando contraseña en BD para ID: ${userId}...`);
        
        const currentPassword = await userModel.findPasswordById(Number(userId));
        
        console.log(`Resultado de la búsqueda: ${currentPassword ? 'ENCONTRADO' : 'NULL (No encontrado)'}`);
        
        if (!currentPassword) {
            console.log("ERROR: Usuario no encontrado en la base de datos.");
            return res.status(404).json({ message: "Usuario no encontrado (ID inválido)." });
        }

        console.log(`Comparando: '${currentPassword}' (BD) vs '${oldPassword}' (Input)`);
        
        if (currentPassword !== oldPassword) {
            console.log("ERROR: Contraseña incorrecta.");
            return res.status(401).json({ message: "La contraseña actual es incorrecta." });
        }
        
        await userModel.changePassword(Number(userId), newPassword);
        console.log("ÉXITO: Contraseña actualizada.");

        res.status(200).json({ message: "Contraseña actualizada con éxito." });

    } catch (error) {
        console.error('CRASH EN CONTROLADOR:', error);
        res.status(500).json({ message: "Error interno al actualizar la contraseña." });
    }
};