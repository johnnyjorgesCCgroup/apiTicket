// app.js
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productRoutes from './productRoutes.js';
import ticketRoutes from './ticketRoutes.js'; // Importa las rutas de productos

config();

const app = express();

// Middleware CORS
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

// Usa las rutas de tickets
app.use('/tickets', ticketRoutes);

// Usa las rutas de productos
app.use('/products', productRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
