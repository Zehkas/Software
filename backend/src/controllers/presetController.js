const presetModel = require('../models/presetModel');
const fs = require('fs');

const getFilePath = (filename) => {
    return path.join(__dirname, '../../public/uploads/presets', path.basename(filename));
};


exports.createPreset = async (req, res) => {
    const { nombre, descripcion, categoria, precio } = req.body;
    const imagen_url = req.file ? `/uploads/presets/${req.file.filename}` : null; 

    if (!nombre || !precio || !imagen_url) {
        if (req.file) {
            fs.unlinkSync(req.file.path); 
        }
        return res.status(400).json({ message: "Faltan campos obligatorios (nombre, precio, imagen)." });
    }
    
    const numericPrecio = parseFloat(precio);

    try {
        await presetModel.createPreset({ 
            nombre, 
            descripcion, 
            categoria, 
            precio: numericPrecio, 
            imagen_url 
        });

        res.status(201).json({ message: "Preset creado exitosamente." });
        
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Error al crear preset:', error);
        
        if (error.errorNum === 1) { 
            return res.status(400).json({ message: "El nombre del Preset ya existe." });
        }
        res.status(500).json({ message: "Error interno al guardar el preset." });
    }
};


exports.getAllPresets = async (req, res) => {
    try {
        const presets = await presetModel.findAllPresets(); 
        res.status(200).json(presets);

    } catch (error) {
        console.error('Error al obtener presets:', error);
        res.status(500).json({ message: "Error al obtener la lista de presets." });
    }
};

exports.updatePreset = async (req, res) => {
    const { id } = req.params; 
    const { nombre, descripcion, categoria, precio, estado, current_imagen_url } = req.body;
    
    let imagen_url_final = current_imagen_url || null;
    
    try {

        if (req.file) {
            imagen_url_final = `/uploads/presets/${req.file.filename}`;
        } else if (!current_imagen_url) {
            return res.status(400).send({ message: 'Se requiere la imagen del preset para actualizar.' });
        }

        const result = await presetModel.updatePreset(Number(id), {
            nombre,
            descripcion,
            categoria,
            precio: Number(precio),
            imagen_url: imagen_url_final,
            estado: Number(estado)
        });

        if (result.rowsAffected === 0) {
            return res.status(404).send({ message: `Preset con ID ${id} no encontrado.` });
        }

        res.status(200).send({ 
            message: 'Preset actualizado exitosamente.', 
            nombre, 
            id_preset: id,
            imagen_url: imagen_url_final
        });

    } catch (error) {
        console.error('Error al actualizar preset:', error);
        if (error.code === 'ORA-00001') {
            return res.status(400).send({ message: 'El nombre del Preset ya existe. El nombre debe ser único.' });
        }
        res.status(500).send({ message: 'Error interno del servidor al actualizar preset.' });
    }
};

exports.deletePreset = async (req, res) => {
    const { id } = req.params;

    try {
        
        const result = await presetModel.deletePreset(Number(id));

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: "Preset no encontrado para eliminar." });
        }


        res.status(200).json({ message: "Preset eliminado correctamente." });
    } catch (error) {
        console.error('Error al eliminar preset:', error);
        res.status(500).json({ message: "Error al eliminar el preset." });
    }
};