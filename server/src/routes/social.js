import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// All social routes require authentication
router.use(requireAuth);

// Post to social media
router.post('/post', async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Social media posting endpoint - to be implemented'
    });
  } catch (error) {
    next(error);
  }
});

// Get social media accounts
router.get('/accounts', async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Social accounts endpoint - to be implemented'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
