const express = require('express');
const router = express.Router();

const validate = require('./validation');

const contactsController = require('../../controllers/controllerContacts');

router
  .get('/', contactsController.getContacts)
  .post('/', validate.createContact, contactsController.addContact);

router
  .get('/:contactId', contactsController.getContactById)
  .delete('/:contactId', contactsController.deleteContactById)
  .patch(
    '/:contactId',
    validate.updateContact,
    contactsController.updateContactById,
  );

module.exports = router;
