const { openConnection } = require('../config/db');
const oracledb = require('oracledb');

async function createUser(userData) {
    const { nombre, apellido, email, password } = userData;
    let connection;

    try {
        connection = await openConnection();
        
        // Rol 0 = CLIENTE por defecto.
        const sql = `
            INSERT INTO USUARIOS (nombre, apellido, email, password, rol)
            VALUES (:nombre, :apellido, :email, :password, 0) 
        `;
        
        const binds = {
            nombre: nombre,
            apellido: apellido,
            email: email,
            password: password
        };
        
        const result = await connection.execute(sql, binds);

        return result;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function findUserByEmail(email) {
    let connection;

    try {
        connection = await openConnection();

        const sql = `
            SELECT id_usuario, nombre, apellido, email, password, rol 
            FROM USUARIOS 
            WHERE email = :email
        `;
        

        const result = await connection.execute(sql, { email: email }); 

        return result.rows[0];

    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}


async function changePassword(userId, newPassword) {
    let connection;

    try {
        connection = await openConnection();
        const sql = `
            UPDATE USUARIOS
            SET password = :newPassword
            WHERE id_usuario = :userId 
        `;
        const binds = {
            newPassword,
            userId
        };
        const result = await connection.execute(sql, binds, { autoCommit: true });
        return result;

    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function findPasswordById(userId) {
    let connection;
    try {
        connection = await openConnection();

        const sql = `SELECT password FROM USUARIOS WHERE id_usuario = :userId`;
        const result = await connection.execute(sql, { userId });
        

        if (result.rows.length > 0) {
            const row = result.rows[0];
            

            console.log("   [MODELO] Estructura de la fila:", row);


            if (Array.isArray(row)) {
                return row[0]; 
            } 
            
            else {
                return row.PASSWORD || row.password; 
            }
        }
        
        return null; 

    } catch (err) {
        console.error("   [MODELO ERROR]", err);
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

module.exports = { createUser, findUserByEmail, changePassword, findPasswordById };