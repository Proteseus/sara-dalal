import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const rateProduct = async (req, res) => {
  try {
    const { productId, rating, routineId } = req.body;
    const userId = req.user.id;

    const i = parseInt(productId);
    const r = parseInt(routineId);

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Create or update feedback
    const productFeedback = await prisma.userFeedback.upsert({
      where: {
        userId_productId_routineId: {
          userId,
          productId: i,
          routineId: r || null
        }
      },
      update: {
        rating
      },
      create: {
        userId,
        productId: i,
        routineId: r || null,
        rating
      }
    });

    res.json(productFeedback);
  } catch (error) {
    console.error('Error rating product:', error);
    res.status(500).json({ error: 'Error rating product' });
  }
}; 