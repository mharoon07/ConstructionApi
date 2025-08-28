import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import calculatorRoutes from './Routes/calculatorRoutes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/calculators', calculatorRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));