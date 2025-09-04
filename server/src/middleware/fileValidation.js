import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 1 // Only allow 1 file at a time
  }
});

/**
 * Middleware to process and validate uploaded images
 */
export const processImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const file = req.file;

    // Validate image using sharp
    try {
      const metadata = await sharp(file.buffer).metadata();
      
      // Check image dimensions (minimum requirements)
      const minWidth = 300;
      const minHeight = 300;
      const maxWidth = 4000;
      const maxHeight = 4000;

      if (metadata.width < minWidth || metadata.height < minHeight) {
        return res.status(400).json({
          success: false,
          error: `Image too small. Minimum dimensions: ${minWidth}x${minHeight}px`
        });
      }

      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        return res.status(400).json({
          success: false,
          error: `Image too large. Maximum dimensions: ${maxWidth}x${maxHeight}px`
        });
      }

      // Process image - create optimized versions
      const processedImages = await Promise.all([
        // Original size (optimized)
        sharp(file.buffer)
          .jpeg({ quality: 90, progressive: true })
          .toBuffer(),
        
        // Thumbnail (300x300)
        sharp(file.buffer)
          .resize(300, 300, { 
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: 85 })
          .toBuffer(),
        
        // Medium size (800x800)
        sharp(file.buffer)
          .resize(800, 800, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 88 })
          .toBuffer()
      ]);

      // Add processed images to request
      req.processedImages = {
        original: {
          buffer: processedImages[0],
          filename: `${uuidv4()}-original.jpg`,
          mimetype: 'image/jpeg'
        },
        thumbnail: {
          buffer: processedImages[1],
          filename: `${uuidv4()}-thumb.jpg`,
          mimetype: 'image/jpeg'
        },
        medium: {
          buffer: processedImages[2],
          filename: `${uuidv4()}-medium.jpg`,
          mimetype: 'image/jpeg'
        }
      };

      // Add original file metadata
      req.imageMetadata = {
        originalName: file.originalname,
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
      };

      next();
    } catch (sharpError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image file or corrupted data'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Error handling middleware for multer
 */
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          error: `File too large. Maximum size: ${(parseInt(process.env.MAX_FILE_SIZE) || 10485760) / 1024 / 1024}MB`
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          error: 'Too many files. Only 1 file allowed.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          error: 'Unexpected file field'
        });
      default:
        return res.status(400).json({
          success: false,
          error: 'File upload error'
        });
    }
  }
  
  next(error);
};
