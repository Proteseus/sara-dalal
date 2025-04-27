import express from 'express';
import { rateProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/rate', authenticateToken, rateProduct);

export default router; 