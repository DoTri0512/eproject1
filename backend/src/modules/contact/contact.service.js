const Contact = require('./contact.model');
const { getPagination, formatPaginationResponse } = require('../../utils/pagination');

class ContactService {
  async createContact(data) {
    return Contact.create(data);
  }

  async getAllContacts(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { phone: { $regex: query.search, $options: 'i' } },
        { message: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      Contact.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Contact.countDocuments(filter),
    ]);

    return formatPaginationResponse(items, totalItems, page, limit);
  }

  async updateContactStatus(id, status) {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      const error = new Error('Contact message not found');
      error.statusCode = 404;
      throw error;
    }

    return contact;
  }

  async deleteContact(id) {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      const error = new Error('Contact message not found');
      error.statusCode = 404;
      throw error;
    }

    return { message: 'Contact message deleted successfully' };
  }
}

module.exports = new ContactService();
