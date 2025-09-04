import { supabase } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class StorageService {
  constructor() {
    this.bucket = 'product-images';
  }

  /**
   * Upload file to Supabase Storage
   */
  async uploadFile(buffer, filename, userId, options = {}) {
    try {
      // Create user-specific folder path
      const filePath = `${userId}/${filename}`;

      const { data, error } = await supabase.storage
        .from(this.bucket)
        .upload(filePath, buffer, {
          contentType: options.contentType || 'image/jpeg',
          cacheControl: '3600',
          upsert: options.upsert || false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucket)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        publicUrl,
        fullPath: data.fullPath
      };
    } catch (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple processed images
   */
  async uploadProcessedImages(processedImages, userId) {
    try {
      const uploadPromises = Object.entries(processedImages).map(
        async ([size, imageData]) => {
          const result = await this.uploadFile(
            imageData.buffer,
            imageData.filename,
            userId,
            { contentType: imageData.mimetype }
          );
          return { size, ...result };
        }
      );

      const results = await Promise.all(uploadPromises);
      
      // Convert array to object with size as key
      return results.reduce((acc, result) => {
        acc[result.size] = {
          path: result.path,
          publicUrl: result.publicUrl,
          fullPath: result.fullPath
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove([filePath]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Storage delete error:', error);
      throw error;
    }
  }

  /**
   * Delete multiple files
   */
  async deleteFiles(filePaths) {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove(filePaths);

      if (error) {
        throw new Error(`Bulk delete failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Storage bulk delete error:', error);
      throw error;
    }
  }

  /**
   * Get file info
   */
  async getFileInfo(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .list(filePath.split('/').slice(0, -1).join('/'), {
          search: filePath.split('/').pop()
        });

      if (error) {
        throw new Error(`Get file info failed: ${error.message}`);
      }

      return data[0] || null;
    } catch (error) {
      console.error('Get file info error:', error);
      throw error;
    }
  }

  /**
   * List user files
   */
  async listUserFiles(userId, options = {}) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .list(userId, {
          limit: options.limit || 100,
          offset: options.offset || 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw new Error(`List files failed: ${error.message}`);
      }

      // Add public URLs to each file
      const filesWithUrls = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from(this.bucket)
          .getPublicUrl(`${userId}/${file.name}`);

        return {
          ...file,
          publicUrl,
          fullPath: `${userId}/${file.name}`
        };
      });

      return filesWithUrls;
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for private access (if needed)
   */
  async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        throw new Error(`Get signed URL failed: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Get signed URL error:', error);
      throw error;
    }
  }

  /**
   * Move file to different location
   */
  async moveFile(fromPath, toPath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .move(fromPath, toPath);

      if (error) {
        throw new Error(`Move file failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Move file error:', error);
      throw error;
    }
  }

  /**
   * Copy file to different location
   */
  async copyFile(fromPath, toPath) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucket)
        .copy(fromPath, toPath);

      if (error) {
        throw new Error(`Copy file failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Copy file error:', error);
      throw error;
    }
  }

  /**
   * Get storage usage for user
   */
  async getUserStorageUsage(userId) {
    try {
      const files = await this.listUserFiles(userId);
      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      
      return {
        fileCount: files.length,
        totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2)
      };
    } catch (error) {
      console.error('Get storage usage error:', error);
      throw error;
    }
  }
}

export default new StorageService();
