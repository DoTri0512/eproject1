const path = require('path');
const fs = require('fs');
const { successResponse, errorResponse } = require('../../utils/response');

class UploadController {
  uploadSingleImage(req, res, next) {
    try {
      if (!req.file) {
        return errorResponse(res, 'Please provide an image file to upload', 400);
      }

      const file = req.file;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      const relativeUrl = `/uploads/${file.filename}`;

      const fileData = {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: relativeUrl,
        url: fileUrl,
      };

      return successResponse(res, fileData, 'Image uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  uploadMultipleImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return errorResponse(res, 'Please provide at least one image file to upload', 400);
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadedFiles = req.files.map((file) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        url: `${baseUrl}/uploads/${file.filename}`,
      }));

      return successResponse(
        res,
        {
          total: uploadedFiles.length,
          files: uploadedFiles,
        },
        'Images uploaded successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  deleteImage(req, res, next) {
    try {
      const { filename } = req.params;
      if (!filename) {
        return errorResponse(res, 'Filename is required', 400);
      }

      // Prevent directory traversal attacks
      const sanitizedFilename = path.basename(filename);
      const filePath = path.join(__dirname, '../../../uploads', sanitizedFilename);

      if (!fs.existsSync(filePath)) {
        return errorResponse(res, 'File not found', 404);
      }

      fs.unlinkSync(filePath);
      return successResponse(res, null, 'Image deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();
