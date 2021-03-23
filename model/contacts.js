const Contact = require('./schemas/contact');

const getContacts = async () => {
  const result = await Contact.find({});
  return result;
};

const getContactById = async contactId => {
  const result = await Contact.findById({ _id: contactId });
  return result;
};

const addContact = async body => {
  const newContact = await Contact.create(body);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true },
  );
  return result;
};

const removeContact = async contactId => {
  const result = await Contact.findByIdAndRemove({ _id: contactId });
  return result;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
