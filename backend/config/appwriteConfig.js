require('dotenv').config();
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const MENU_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;

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