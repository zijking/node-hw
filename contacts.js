const path = require('path');
const fs = require('fs');

// Раскомментируй и запиши значение
const contactsPath = path.join(__dirname, './db/contacts.json');
const newFile = path.join(__dirname, `./db/contacts${Date.now()}.json`);

const fileContent = fs.readFileSync(contactsPath).toString();
var fileDataObj = JSON.parse(fileContent);

// TODO: задокументировать каждую функцию
function listContacts() {
  // ...твой код
  console.log('list view');
  console.table(fileDataObj);
}

function getContactById(contactId) {
  // ...твой код
  const contact = fileDataObj.find(el => el.id === contactId);

  if (contact) {
    console.log(contact);
  } else {
    console.log('Not found');
  }
}

function removeContact(contactId) {
  // ...твой код
  const temp = fileDataObj.filter(el => el.id != contactId);
  // const maxId = Math.max(...fileDataObj.map(el => el.id));

  console.table(temp);
  writeContactsToFile(fileDataObj);
  // console.log('maxId: ', maxId);
}

function addContact(name, email, phone) {
  // ...твой код
  // console.log(fileDataObj.length);
  const newContact = {
    id: Math.max(...fileDataObj.map(el => el.id)) + 1,
    name,
    email,
    phone,
  };

  fileDataObj.push(newContact);
  writeContactsToFile(fileDataObj);
  // console.log(fileDataObj.length);
}

module.exports = { listContacts, getContactById, removeContact, addContact };

//запис у файл зміненого обєкту контактів
function writeContactsToFile(contactsArray) {
  fs.writeFileSync(contactsPath, JSON.stringify(contactsArray), err => {
    console.log(err.messege);
  });
}
