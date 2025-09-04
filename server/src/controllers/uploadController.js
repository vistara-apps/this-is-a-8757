import storageService from '../services/storageService.js';
import { validationResult } from 'express-validator';

/**
 * Upload product image
 */
export const uploadProductImage = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = req.user;
    const processedImages = req.processedImages;
    const imageMetadata = req.imageMetadata;

    if (!processedImages) {
      return res.status(400).json({
        success: false,
        error: 'No processed images found'
      });
    }

    // Upload all processed image versions to storage
    const uploadResults = await storageService.uploadProcessedImages(
      processedImages,
      user.userId
    );

    // Return upload results with metadata
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        images: uploadResults,
        metadata: imageMetadata,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's uploaded images
 */
export const getUserImages = async (req, res, next) => {
  try {
    const user = req.user;
    const { limit = 20, offset = 0 } = req.query;

    const images = await storageService.listUserFiles(user.userId, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: images.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete uploaded image
 */
export const deleteImage = async (req, res, next) => {
  try {
    const user = req.user;
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Filename is required'
      });
    }

    // Construct file path
    const filePath = `${user.userId}/${filename}`;

    // Delete from storage
    await storageService.deleteFile(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get storage usage for user
 */
export const getStorageUsage = async (req, res, next) => {
  try {
    const user = req.user;

    const usage = await storageService.getUserStorageUsage(user.userId);

    res.json({
      success: true,
      data: usage
    });
  } catch (error) {
    next(error);
  }
};
