const express = require('express');
const { databases, DATABASE_ID, MENU_COLLECTION_ID } = require('../config/appwriteConfig');
const { ID } = require('node-appwrite');

const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
    console.log('Receiving GET request for all menu items');
    try {
        const response = await databases.listDocuments(DATABASE_ID, MENU_COLLECTION_ID);
        console.log('Retrieved menu items:', response.documents);
        res.json(response.documents);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: error.message });
    }
});



router.post('/', async (req, res) => {
    console.log('Receiving POST request with body:', req.body);
    try {
        const newItem = req.body;
        console.log('Creating document with data:', newItem);
        
        // Generate a unique menu_id or use the provided one
        const menuId = newItem.menu_id || ID.unique();
        
        // Include the menu_id in the document data
        const documentData = {
            ...newItem,
            menu_id: menuId
        };
        
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                MENU_COLLECTION_ID,
                ID.unique(),  // Document ID (separate from menu_id)
                documentData  // Include menu_id in the data
            );
            
            console.log('Document created successfully:', response);
            res.json(response);
        } catch (appwriteError) {
            console.error('Appwrite Error:', {
                message: appwriteError.message,
                code: appwriteError.code,
                type: appwriteError.type,
                details: appwriteError.response
            });
            res.status(appwriteError.code || 500).json({
                error: appwriteError.message,
                type: appwriteError.type
            });
        }
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET all menu items
router.get('/allmenu', async (req, res) => {
    console.log('Receiving GET request for all menu items');
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            MENU_COLLECTION_ID,
            [] // No queries/filters
        );
        
        console.log('Retrieved menu items:', response.documents);
        res.json(response.documents);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.response || 'No additional details'
        });
    }
});

module.exports = router;

