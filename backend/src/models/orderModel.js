// backend/src/models/orderModel.js

const { openConnection } = require('../config/db');
const oracledb = require('oracledb');


async function createOrder(userId, presetId, total) {
    let connection;

    try {
        connection = await openConnection();
        await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');


        const orderSql = `
            INSERT INTO PEDIDOS (id_usuario, monto_total, tipo_pedido, estado_pedido)
            VALUES (:id_usuario, :monto_total, 'PRESET', 'PENDIENTE') 
            RETURNING id_pedido INTO :id_pedido
        `;
        
        const orderBinds = {
            id_usuario: userId,
            monto_total: total,
            id_pedido: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } 
        };

        let orderResult = await connection.execute(orderSql, orderBinds, { autoCommit: false });
        
        const orderId = orderResult.outBinds.id_pedido[0]; 


        const detailSql = `
            INSERT INTO DETALLE_PEDIDO (id_pedido, id_preset, precio_unitario)
            VALUES (:id_pedido, :id_preset, :precio_unitario)
        `;
        const detailBinds = {
            id_pedido: orderId,
            id_preset: presetId,
            precio_unitario: total
        };
        await connection.execute(detailSql, detailBinds, { autoCommit: false });

        await connection.commit();
        return { orderId, success: true };

    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error al ejecutar la transacción de compra:", err);
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}


async function findUserOrders(userId) {
    let connection;
    try {
        connection = await openConnection();
        
        const sql = `
            SELECT 
                p.id_pedido, 
                p.fecha_pedido, 
                p.monto_total, 
                p.tipo_pedido, 
                p.estado_pedido,
                p.titulo_custom,       
                p.descripcion_custom,
                
                (SELECT ruta_archivo FROM ARCHIVOS_CUSTOM ac WHERE ac.id_pedido = p.id_pedido AND ROWNUM = 1) AS imagen_custom,
                
                d.precio_unitario, 
                pr.nombre AS preset_nombre, 
                pr.descripcion AS preset_descripcion,
                pr.imagen_url AS imagen_preset
            FROM PEDIDOS p
            LEFT JOIN DETALLE_PEDIDO d ON p.id_pedido = d.id_pedido 
            LEFT JOIN PRESETS pr ON d.id_preset = pr.id_preset
            WHERE p.id_usuario = :userId
            ORDER BY p.fecha_pedido DESC
        `;
        
        const result = await connection.execute(sql, { userId });
        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}



async function findAllOrders() {
    let connection;

    try {
        connection = await openConnection();
        
        const sql = `
            SELECT 
                p.id_pedido, 
                p.fecha_pedido, 
                p.monto_total, 
                p.tipo_pedido,
                p.estado_pedido,
                u.nombre AS usuario_nombre, 
                u.email AS usuario_email,
                d.precio_unitario, 
                pr.nombre AS preset_nombre
            FROM PEDIDOS p
            JOIN USUARIOS u ON p.id_usuario = u.id_usuario 
            JOIN DETALLE_PEDIDO d ON p.id_pedido = d.id_pedido
            JOIN PRESETS pr ON d.id_preset = pr.id_preset
            ORDER BY p.fecha_pedido DESC
        `;
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

async function updateOrderStatus(orderId, newStatus) {
    let connection;
    try {
        connection = await openConnection();
        const sql = `UPDATE PEDIDOS SET estado_pedido = :newStatus WHERE id_pedido = :orderId`;
        const result = await connection.execute(sql, { newStatus, orderId }, { autoCommit: true });
        return result;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

async function createCustomOrder(userId, title, description, total, files) {
    let connection;
    try {
        connection = await openConnection();
        await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

        // 1. Insertar el Pedido (RF-13)
        const orderSql = `
            INSERT INTO PEDIDOS (id_usuario, monto_total, tipo_pedido, estado_pedido, titulo_custom, descripcion_custom)
            VALUES (:id_usuario, :monto_total, 'CUSTOM', 'PENDIENTE', :titulo, :descripcion)
            RETURNING id_pedido INTO :id_pedido
        `;
        
        const orderBinds = {
            id_usuario: userId,
            monto_total: total,
            titulo: title,
            descripcion: description,
            id_pedido: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        };

        const result = await connection.execute(orderSql, orderBinds, { autoCommit: false });
        const orderId = result.outBinds.id_pedido[0];


        if (files && files.length > 0) {
            const fileSql = `
                INSERT INTO ARCHIVOS_CUSTOM (id_pedido, ruta_archivo, nombre_archivo)
                VALUES (:id_pedido, :ruta, :nombre)
            `;

            for (const file of files) {
                const webPath = `/uploads/custom/${file.filename}`;
                
                await connection.execute(fileSql, {
                    id_pedido: orderId,
                    ruta: webPath,
                    nombre: file.originalname
                }, { autoCommit: false });
            }
        }

        await connection.commit();
        return { orderId, success: true };

    } catch (err) {
        if (connection) await connection.rollback();
        throw err;
    } finally {
        if (connection) try { await connection.close(); } catch (e) {}
    }
}



async function findAllOrders() {
    let connection;
    try {
        connection = await openConnection();

        const sql = `
            SELECT 
                p.id_pedido, 
                p.fecha_pedido, 
                p.monto_total, 
                p.tipo_pedido, 
                p.estado_pedido, 
                p.titulo_custom,
                u.nombre || ' ' || u.apellido AS usuario_nombre, 
                u.email AS usuario_email,
                pr.nombre AS preset_nombre
            FROM PEDIDOS p
            JOIN USUARIOS u ON p.id_usuario = u.id_usuario
            LEFT JOIN DETALLE_PEDIDO d ON p.id_pedido = d.id_pedido
            LEFT JOIN PRESETS pr ON d.id_preset = pr.id_preset
            ORDER BY p.fecha_pedido DESC
        `;
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

async function getOrderFiles(orderId) {
    let connection;
    try {
        connection = await openConnection();
        const sql = `SELECT ruta_archivo, nombre_archivo FROM ARCHIVOS_CUSTOM WHERE id_pedido = :orderId`;
        const result = await connection.execute(sql, { orderId });
        return result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (connection) {
            try { await connection.close(); } catch (e) { console.error(e); }
        }
    }
}

















module.exports = {
    createOrder,
    findUserOrders,
    findAllOrders,
    updateOrderStatus,
    createCustomOrder,
    getOrderFiles
};