import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import productRoutes from './productRoutes.js';
import ticketRoutes from './ticketRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import subCategoryRoutes from './subCategoryRoutes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

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

// Usa las rutas de productos
app.use('/category', categoryRoutes);

// Usa las rutas de productos
app.use('/subcategory', subCategoryRoutes);



// Configuración de Swagger
const swaggerDocument = YAML.load('./swagger.yaml'); // Ruta al archivo OpenAPI

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar el servidor
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
