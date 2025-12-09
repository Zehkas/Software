
const { openConnection } = require('../config/db');
const oracledb = require('oracledb'); 

async function createPreset(data) {
    const { nombre, descripcion, categoria, precio, imagen_url } = data;
    let connection;

    try {
        connection = await openConnection();
        
        const sql = `
            INSERT INTO PRESETS (nombre, descripcion, categoria, precio, imagen_url, estado)
            VALUES (:nombre, :descripcion, :categoria, :precio, :imagen_url, 1)
        `;
        
        const binds = {
            nombre, 
            descripcion, 
            categoria, 
            precio, 
            imagen_url
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

async function findAllPresets() {
    let connection;

    try {
        connection = await openConnection();
        
        const sql = `SELECT * FROM PRESETS ORDER BY id_preset DESC`;
        
        const result = await connection.execute(sql); 

        return result.rows;

    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function updatePreset(id_preset, data) {
    const { nombre, descripcion, categoria, precio, imagen_url, estado } = data;
    let connection;

    try {
        connection = await openConnection();
        
        const sql = `
            UPDATE PRESETS
            SET nombre = :nombre, 
                descripcion = :descripcion, 
                categoria = :categoria, 
                precio = :precio, 
                imagen_url = :imagen_url,
                estado = :estado
            WHERE id_preset = :id_preset
        `;
        
        const binds = {
            nombre,
            descripcion,
            categoria,
            precio,
            imagen_url,
            estado,
            id_preset
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



module.exports = {
    createPreset,
    findAllPresets,
    updatePreset,
    deletePreset
};