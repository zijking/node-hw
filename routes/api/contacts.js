const express = require('express');
const router = express.Router();

const contactsApi = require('../../model/contacts');

router.get('/', async (req, res, next) => {
  try {
    // const cats = await Cats.getAll();
    const contacts = await contactsApi.getContacts();
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
});

router.get('/:contactId', async (req, res, next) => {
  try {
    // const cat = await Cats.getById(req.params.id);
    console.log('req.params.contactId =', req.params.contactId);
    const contact = await contactsApi.getContactById(req.params.contactId);
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
});

router.post('/', async (req, res, next) => {
  try {
    const contact = await contactsApi.addContact(req.body);
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
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsApi.removeContact(req.params.contactId);

    console.log('contact API: ', contact);

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
});

router.patch('/:contactId', async (req, res, next) => {
  try {
    const contact = await contactsApi.updateContact(
      req.params.contactId,
      req.body,
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
});

module.exports = router;
