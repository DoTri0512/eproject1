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

  async getCollectionDestinations(req, res, next) {
    try {
      const destinations = await collectionService.getCollectionDestinations(req.params.idOrSlug);
      return successResponse(res, destinations, 'Collection destinations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addDestinations(req, res, next) {
    try {
      const collection = await collectionService.addDestinationsToCollection(
        req.params.id,
        req.body.destinationIds
      );
      return successResponse(res, collection, 'Destinations added to collection successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeDestination(req, res, next) {
    try {
      const collection = await collectionService.removeDestinationFromCollection(
        req.params.id,
        req.params.destinationId
      );
      return successResponse(res, collection, 'Destination removed from collection successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeDestinations(req, res, next) {
    try {
      const collection = await collectionService.removeDestinationsFromCollection(
        req.params.id,
        req.body.destinationIds
      );
      return successResponse(res, collection, 'Destinations removed from collection successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CollectionController();
