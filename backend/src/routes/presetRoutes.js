
const express = require('express');
const router = express.Router();
const presetController = require('../controllers/presetController');
const upload = require('../config/multerConfig');



router.post(
    '/', 
    upload.single('presetImage'),
    presetController.createPreset
);


router.get('/', presetController.getAllPresets);


router.put(
    '/:id', 
    upload.single('presetImage'),
    presetController.updatePreset
);


module.exports = router;