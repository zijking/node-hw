const app = require('../app');
const db = require('../model/db');
const createFolderIsExist = require('../helpers/create-dir');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR;
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

    await createFolderIsExist(UPLOAD_DIR);
    await createFolderIsExist(AVATARS_OF_USERS);
    console.log(`Server runing. PORT = ${PORT}`);
  });
}).catch(err => {
  console.log(`Server start ERROR. Message: ${err.message}`);
  process.exit(1);
});
