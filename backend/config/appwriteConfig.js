

require('dotenv').config();
const { Client, Databases, Storage, ID, Permission, Role } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const MENU_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID;
const IMAGE_BUCKET_ID = process.env.APPWRITE_IMAGE_BUCKET_ID;

// Test the connection
databases.listCollections(DATABASE_ID)
    .then(() => console.log('Successfully connected to Appwrite'))
    .catch(error => console.error('Appwrite connection error:', error));

storage.listBuckets()
    .then(() => console.log('Successfully connected to Appwrite Storage'))
    .catch(error => console.error('Appwrite Storage connection error:', error));

storage.listBuckets()
    .then(response => {
        console.log('Successfully connected to Appwrite Storage');
        // Try to get specific bucket info to verify access
        return storage.getBucket(IMAGE_BUCKET_ID);
    })
    .then(bucket => {
        console.log('Successfully accessed image bucket:', bucket.name);
    })
    .catch(error => console.error('Appwrite Storage connection or bucket access error:', error));

module.exports = { 
    databases,
    storage,
    DATABASE_ID,
    MENU_COLLECTION_ID,
    IMAGE_BUCKET_ID,
    ID,
    Permission,
    Role
};
