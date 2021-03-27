const contactsApi = require('../model/contacts');

const getContacts = async (req, res, next) => {
  try {
    // const cats = await Cats.getAll();
    const userId = req.user.id;
    const contacts = await contactsApi.getContacts(userId);
    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    // console.log('req.params.contactId =', req.params.contactId);
    const userId = req.user.id;
    const contact = await contactsApi.getContactById(
      req.params.contactId,
      userId,
    );
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not Found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await contactsApi.addContact({
      ...req.body,
      owner: userId,
    });
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await contactsApi.removeContact(
      req.params.contactId,
      userId,
    );

    // console.log('contact API: ', contact);

    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          message: 'contact deleted',
        },
      });
    } else {
      return res.json({
        status: 'error',
        code: 404,
        data: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await contactsApi.updateContact(
      req.params.contactId,
      req.body,
      userId,
    );
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not Found or missing fields',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContactById,
  updateContactById,
};
