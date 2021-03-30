const express = require('express');
const router = express.Router();
const validate = require('./validation');
const contactsController = require('../../../controllers/controllerContacts');
const guard = require('../../../helpers/guard');

router
  .get('/', guard, contactsController.getContacts)
  .post('/', guard, validate.createContact, contactsController.addContact);

router
  .get('/:contactId', guard, contactsController.getContactById)
  .delete('/:contactId', guard, contactsController.deleteContactById)
  .patch(
    '/:contactId',
    guard,
    validate.updateContact,
    contactsController.updateContactById,
  );

module.exports = router;
