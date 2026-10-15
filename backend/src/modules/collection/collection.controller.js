const collectionService = require('./collection.service');
const { successResponse } = require('../../utils/response');

class CollectionController {
  async getAllCollections(req, res, next) {
    try {
      const result = await collectionService.getAllCollections(req.query);
      return successResponse(res, result, 'Collections retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getCollection(req, res, next) {
    try {
      const collection = await collectionService.getCollectionByIdOrSlug(req.params.idOrSlug);
      return successResponse(res, collection, 'Collection retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async createCollection(req, res, next) {
    try {
      const collection = await collectionService.createCollection(req.body);
      return successResponse(res, collection, 'Collection created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCollection(req, res, next) {
    try {
      const collection = await collectionService.updateCollection(req.params.id, req.body);
      return successResponse(res, collection, 'Collection updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteCollection(req, res, next) {
    try {
      const result = await collectionService.deleteCollection(req.params.id);
      return successResponse(res, result, 'Collection deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CollectionController();
