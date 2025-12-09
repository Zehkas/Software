

const orderModel = require('../models/orderModel');


exports.processPurchase = async (req, res) => {

    const { userId, presetId, totalAmount } = req.body; 

    if (!userId || !presetId || !totalAmount) {
        return res.status(400).json({ message: "Faltan datos para procesar la compra." });
    }

    try {

        const result = await orderModel.createOrder(Number(userId), Number(presetId), Number(totalAmount));
        


        res.status(201).json({ 
            message: "Compra procesada con éxito y pedido registrado.",
            orderId: result.orderId,

        });

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({ message: "Error interno al registrar el pedido." });
    }
};



exports.getUserOrders = async (req, res) => {

    const { userId } = req.params; 

    try {
        const orders = await orderModel.findUserOrders(Number(userId));
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener pedidos del usuario:', error);
        res.status(500).json({ message: "Error al obtener su historial de pedidos." });
    }
};


exports.getAllOrders = async (req, res) => {

    try {
        const orders = await orderModel.findAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener todos los pedidos:', error);
        res.status(500).json({ message: "Error al obtener la lista de pedidos." });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { estado } = req.body;
    
    if (!estado) {
        return res.status(400).json({ message: "El nuevo estado es requerido." });
    }

    try {

        const result = await orderModel.updateOrderStatus(Number(orderId), estado.toUpperCase());
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: "Pedido no encontrado para actualizar." });
        }

        res.status(200).json({ message: "Estado del pedido actualizado con éxito." });
    } catch (error) {
        console.error('Error al actualizar el estado:', error);

        res.status(500).json({ message: "Error interno al actualizar el estado del pedido." });
    }
};

exports.createCustomOrder = async (req, res) => {

    const { userId, title, description, total } = req.body;
    const files = req.files;

    if (!userId || !title || !description || !total) {
        return res.status(400).json({ message: "Faltan datos requeridos." });
    }

    try {
        const result = await orderModel.createCustomOrder(
            Number(userId),
            title,
            description,
            Number(total),
            files
        );

        res.status(201).json({ 
            message: "Pedido personalizado registrado con éxito.", 
            orderId: result.orderId 
        });

    } catch (error) {
        console.error('Error al crear pedido custom:', error);
        res.status(500).json({ message: "Error interno al procesar el pedido." });
    }
};


exports.getFilesByOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const files = await orderModel.getOrderFiles(orderId);

        res.json(files); 
    } catch (error) {
        console.error('Error obteniendo archivos:', error);
        res.status(500).json({ message: "Error al obtener archivos." });
    }
};
