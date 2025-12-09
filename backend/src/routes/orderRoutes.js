
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// IMPORTAR MULTER Y PATH (Necesarios para subir archivos)
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/custom/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });



router.post('/purchase', orderController.processPurchase); 
router.post('/custom', upload.array('refImages', 5), orderController.createCustomOrder);


router.get('/user/:userId', orderController.getUserOrders); 

// Ver todos los pedidos (Admin)
router.get('/all', orderController.getAllOrders); 
router.get('/:orderId/files', orderController.getFilesByOrder);

router.put('/status/:orderId', orderController.updateOrderStatus);
    
module.exports = router;