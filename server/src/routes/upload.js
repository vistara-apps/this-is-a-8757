import express from 'express';
import { 
  uploadProductImage, 
  getUserImages, 
  deleteImage, 
  getStorageUsage 
} from '../controllers/uploadController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { upload, processImage, handleUploadError } from '../middleware/fileValidation.js';

const router = express.Router();

// All upload routes require authentication
router.use(requireAuth);

// Upload product image
router.post(
  '/',
  upload.single('image'),
  handleUploadError,
  processImage,
  uploadProductImage
);

// Get user's uploaded images
router.get('/', getUserImages);

// Get storage usage
router.get('/usage', getStorageUsage);

// Delete uploaded image
router.delete('/:filename', deleteImage);

export default router;
