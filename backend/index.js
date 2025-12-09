const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


const authRoutes = require('./src/routes/authRoutes');
const presetRoutes = require('./src/routes/presetRoutes');
const orderRoutes = require('./src/routes/orderRoutes'); 
const userRoutes = require('./src/routes/userRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/presets', presetRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); 


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});