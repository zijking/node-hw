const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const contactsPath = path.join(__dirname, './contacts.json');
const fileContent = fs.readFileSync(contactsPath).toString();

const fileDataObj = JSON.parse(fileContent);

const getContacts = async () => {
  return fileDataObj;
};

const getContactById = async contactId => {
  const id = Number(contactId);

  const contact = fileDataObj.find(el => el.id === id);

  if (contact) {
    return contact;
  } else {
    return null;
  }
};

const removeContact = async contactId => {
  const id = Number(contactId);
  // console.log('contactId', contactId);

  const temp = fileDataObj.filter(el => el.id != id);
  const contact = fileDataObj.find(el => el.id === id);

  // console.log('temp: ', temp);
  // console.log('contact: ', contact);
  if (!contact) {
    return null;
  }
  writeContactsToFile(temp);

  return contact;
};

const addContact = async body => {
  // const id = uuid();
  // console.log(body);
  const id = Math.max(...fileDataObj.map(el => el.id)) + 1;
  const newContact = {
    id,
    ...body,
  };

  fileDataObj.push(newContact);
  writeContactsToFile(fileDataObj);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const id = Number(contactId);
  console.log('body: ', body);

  if (Object.keys(body).length === 0) {
    return null;
  }

  const indexContact = el => el.id === id;
  const contactUp = fileDataObj.findIndex(indexContact);

  fileDataObj[contactUp] = { ...fileDataObj[contactUp], ...body };
  // console.log('contactUp', contactUp);
  writeContactsToFile(fileDataObj);
  return fileDataObj[contactUp];
};

module.exports = {
  getContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

//запис у файл зміненого обєкту контактів
function writeContactsToFile(contactsArray) {
  fs.writeFileSync(contactsPath, JSON.stringify(contactsArray), err => {
    console.log(err.messege);
  });
}
