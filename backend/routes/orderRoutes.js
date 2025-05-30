const express = require('express');
const multer = require('multer');
const { databases, storage, DATABASE_ID, ORDER_COLLECTION_ID, IMAGE_BUCKET_ID, ID, Permission, Role } = require('../config/appwriteConfig');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Create new order
router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log('Received order submission:', req.body);
        
        const {
            customer_name,
            customer_address,
            whatsapp_number,
            pickup_station,
            menu_order
        } = req.body;

        let img_url = '';

        // Handle image upload if provided
        if (req.file) {
            console.log('Processing image upload...');
            try {
                const fileId = ID.unique();
                
                // Create a File object from the buffer
                const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
                const fileObject = new File([fileBlob], req.file.originalname, { 
                    type: req.file.mimetype,
                    lastModified: Date.now()
                });

                // Upload to Appwrite storage
                const uploadResult = await storage.createFile(
                    IMAGE_BUCKET_ID,
                    fileId,
                    fileObject,
                    [Permission.read(Role.any())]
                );

                // Generate the view URL
                img_url = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${IMAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}&mode=admin`;
                
                console.log('Image uploaded successfully:', uploadResult.$id);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                // Continue with order creation even if image upload fails
                console.log('Continuing order creation without image...');
            }
        }

        // Parse menu_order if it's a string, keep as array if it's already an array
        let parsedMenuOrder;
        try {
            parsedMenuOrder = typeof menu_order === 'string' ? JSON.parse(menu_order) : menu_order;
            console.log('Parsed menu order:', parsedMenuOrder);
        } catch (parseError) {
            console.error('Error parsing menu_order:', parseError);
            return res.status(400).json({ error: 'Invalid menu order format' });
        }

        // Ensure parsedMenuOrder is an array
        if (!Array.isArray(parsedMenuOrder)) {
            console.error('Menu order is not an array:', parsedMenuOrder);
            return res.status(400).json({ error: 'Menu order must be an array' });
        }

        // Convert each menu order item to a string (since Appwrite expects array of strings)
        const menuOrderStringArray = parsedMenuOrder.map(item => {
            const itemString = JSON.stringify(item);
            if (itemString.length > 3000) {
                throw new Error(`Menu order item too large: ${itemString.length} characters`);
            }
            return itemString;
        });

        console.log('Menu order string array:', menuOrderStringArray);

        // Create order document
        const orderData = {
            order_id: ID.unique(),
            customer_name,
            customer_address,
            whatsapp_number,
            pickup_station,
            order_status: 'pending',
            img_url: img_url || '',
            menu_order: menuOrderStringArray // Send as array of strings
        };

        console.log('Creating order with data:', orderData);
        console.log('Menu order type:', typeof orderData.menu_order);
        console.log('Menu order is array:', Array.isArray(orderData.menu_order));
        console.log('First menu order item type:', typeof orderData.menu_order[0]);

        const response = await databases.createDocument(
            DATABASE_ID,
            ORDER_COLLECTION_ID,
            ID.unique(),
            orderData
        );

        console.log('Order created successfully:', response.$id);

        res.json({
            success: true,
            orderId: response.$id,
            message: 'Order placed successfully'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Failed to create order'
        });
    }
});

// Get all orders (for admin purposes)
router.get('/', async (req, res) => {
    try {
        const response = await databases.listDocuments(DATABASE_ID, ORDER_COLLECTION_ID);
        
        // Parse the menu_order strings back to objects for easier consumption
        const ordersWithParsedMenuOrder = response.documents.map(order => ({
            ...order,
            menu_order: order.menu_order ? order.menu_order.map(item => {
                try {
                    return JSON.parse(item);
                } catch (e) {
                    return item; // Return as-is if parsing fails
                }
            }) : []
        }));
        
        res.json(ordersWithParsedMenuOrder);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await databases.getDocument(DATABASE_ID, ORDER_COLLECTION_ID, id);
        
        // Parse the menu_order strings back to objects
        const orderWithParsedMenuOrder = {
            ...response,
            menu_order: response.menu_order ? response.menu_order.map(item => {
                try {
                    return JSON.parse(item);
                } catch (e) {
                    return item; // Return as-is if parsing fails
                }
            }) : []
        };
        
        res.json(orderWithParsedMenuOrder);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update order status
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;
        
        const response = await databases.updateDocument(
            DATABASE_ID,
            ORDER_COLLECTION_ID,
            id,
            { order_status }
        );
        
        res.json(response);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;