import express from 'express';
import { rateProduct } from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/rate', authenticate, rateProduct);

export default router; 