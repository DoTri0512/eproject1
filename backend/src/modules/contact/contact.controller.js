const contactService = require('./contact.service');
const { successResponse } = require('../../utils/response');

class ContactController {
  async submitContact(req, res, next) {
    try {
      const contact = await contactService.createContact(req.body);
      return successResponse(
        res,
        contact,
        'Thank you! Your message has been sent successfully.',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  async getAllContacts(req, res, next) {
    try {
      const result = await contactService.getAllContacts(req.query);
      return successResponse(res, result, 'Contact inquiries retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateContactStatus(req, res, next) {
    try {
      const contact = await contactService.updateContactStatus(
        req.params.id,
        req.body.status
      );
      return successResponse(res, contact, 'Contact status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const result = await contactService.deleteContact(req.params.id);
      return successResponse(res, result, 'Contact inquiry deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();
