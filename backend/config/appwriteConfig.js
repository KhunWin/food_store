// const { Client } = require('appwrite');

// const client = new Client();

// client
//     .setEndpoint('https://fra.cloud.appwrite.io/v1')
//     .setProject('683079ff00245e1796d6');

// module.exports = client;

const { Databases } = require('appwrite');

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('683079ff00245e1796d6');

const databases = new Databases(client);

// Create collections
const createCollections = async () => {
    try {
        await databases.createCollection('menu', 'Menu');
        await databases.createCollection('orders', 'Orders');
        await databases.createCollection('stations', 'Stations');
        console.log('Collections created successfully');
    } catch (error) {
        console.error('Error creating collections:', error);
    }
};

createCollections();

module.exports = { databases };