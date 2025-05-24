require('dotenv').config();
const { Client, Databases, ID } = require('node-appwrite');

// Get environment variables with fallbacks
const {
  APPWRITE_ENDPOINT = 'https://fra.cloud.appwrite.io/v1',
  APPWRITE_PROJECT_ID = '6830c09d0020acf8e39a', 
  APPWRITE_API_KEY = 'standard_b2eafdc44a30690f45f8e505504ae4b3ede9f3aecab1cf8c9cb0c6fc37ec4fa99023bbbbb649ac33a0c411e419b8277b1dd543ee55d470eb7c3d5e1149646d57ae2ae55450d354305b7c8fd0293c2b936c12fac2803a48a16c3a743463329c0126a35ba0a8dd91d59d8513fbed2642b840d5c23b834dd9c5c193df50f4794191',
  APPWRITE_DATABASE_ID = '6830c1b0000fe011a914',
  APPWRITE_COLLECTION_ID = '6830c1b9000ee12baf7a'
} = process.env;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = APPWRITE_DATABASE_ID;
const MENU_COLLECTION_ID = APPWRITE_COLLECTION_ID;

// Test the connection
databases.listCollections(DATABASE_ID)
    .then(() => console.log('Successfully connected to Appwrite'))
    .catch(error => console.error('Appwrite connection error:', error));

module.exports = { 
    databases,
    DATABASE_ID,
    MENU_COLLECTION_ID,
    ID
};