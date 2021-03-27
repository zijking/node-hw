const Contact = require('./schemas/contact');

const getContacts = async userId => {
  // console.log('userid: ', userId);
  const result = await Contact.find({ owner: userId }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findById({ _id: contactId, owner: userId });
  return result;
};

const addContact = async body => {
  const newContact = await Contact.create(body);
  return newContact;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  );
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
