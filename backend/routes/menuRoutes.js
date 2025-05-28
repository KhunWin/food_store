
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { databases, storage, DATABASE_ID, MENU_COLLECTION_ID, IMAGE_BUCKET_ID, ID, Permission, Role } = require('../config/appwriteConfig');

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

// Test endpoint to retrieve a file from the bucket
router.get('/test-file/:fileId', async (req, res) => {
    const fileId = req.params.fileId;
    console.log(`Testing file retrieval for file ID: ${fileId}`);
    
    try {
        const fileInfo = await storage.getFile(IMAGE_BUCKET_ID, fileId);
        console.log('File info retrieved:', {
            id: fileInfo.$id,
            name: fileInfo.name,
            mimeType: fileInfo.mimeType,
            sizeOriginal: fileInfo.sizeOriginal,
            bucketId: fileInfo.bucketId,
            $createdAt: fileInfo.$createdAt
        });

        const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${IMAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}&mode=admin`;
        console.log('Generated view URL:', fileUrl);

        res.json({
            success: true,
            fileInfo: fileInfo,
            viewUrl: fileUrl,
            message: 'File retrieved successfully'
        });

    } catch (error) {
        console.error('Error retrieving file:', error);
        res.status(500).json({
            error: error.message,
            details: error.response || 'No additional details',
            type: error.type || 'Unknown error type'
        });
    }
});

// Test endpoint to list all files in the bucket
router.get('/test-bucket', async (req, res) => {
    console.log('Testing bucket access and listing files...');
    
    try {
        const bucketInfo = await storage.getBucket(IMAGE_BUCKET_ID);
        console.log('Bucket info:', {
            id: bucketInfo.$id,
            name: bucketInfo.name,
            enabled: bucketInfo.enabled,
            maximumFileSize: bucketInfo.maximumFileSize,
            allowedFileExtensions: bucketInfo.allowedFileExtensions
        });

        const files = await storage.listFiles(IMAGE_BUCKET_ID);
        console.log(`Found ${files.total} files in bucket`);
        
        files.files.forEach((file, index) => {
            console.log(`File ${index + 1}:`, {
                id: file.$id,
                name: file.name,
                mimeType: file.mimeType,
                size: file.sizeOriginal
            });
        });

        res.json({
            success: true,
            bucketInfo: bucketInfo,
            filesCount: files.total,
            files: files.files,
            message: 'Bucket access successful'
        });

    } catch (error) {
        console.error('Error accessing bucket:', error);
        res.status(500).json({
            error: error.message,
            details: error.response || 'No additional details'
        });
    }
});

// Upload image to Appwrite storage
router.post('/upload', upload.single('image'), async (req, res) => {
    console.log('Receiving image upload request');
    try {
        if (!req.file) {
            console.log('No file received in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            bufferLength: req.file.buffer.length
        });

        const fileId = ID.unique();
        console.log('Generated file ID:', fileId);

        try {
            console.log('Creating File object from buffer...');
            
            // Create a File object from the buffer (correct approach for v9.0.0)
            const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
            const fileObject = new File([fileBlob], req.file.originalname, { 
                type: req.file.mimetype,
                lastModified: Date.now()
            });
            
            console.log('File object created:', {
                name: fileObject.name,
                size: fileObject.size,
                type: fileObject.type
            });

            // Use correct permissions format for v9.0.0
            console.log('Starting upload with correct permissions...');
            const result = await storage.createFile(
                IMAGE_BUCKET_ID,
                fileId,
                fileObject,
                [Permission.read(Role.any())] // Correct format for v9.0.0
            );

            console.log('File uploaded successfully to Appwrite!');
            console.log('Upload result:', {
                id: result.$id,
                name: result.name,
                mimeType: result.mimeType,
                sizeOriginal: result.sizeOriginal,
                bucketId: result.bucketId,
                createdAt: result.$createdAt
            });

            // Generate the view URL
            const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${IMAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}&mode=admin`;
            console.log('Generated file URL:', fileUrl);

            // Verify the file was uploaded
            try {
                const verifyFile = await storage.getFile(IMAGE_BUCKET_ID, fileId);
                console.log('Upload verified! File exists:', {
                    id: verifyFile.$id,
                    name: verifyFile.name,
                    size: verifyFile.sizeOriginal
                });
            } catch (verifyError) {
                console.warn('Could not verify upload:', verifyError.message);
            }

            res.json({
                success: true,
                fileId: result.$id,
                url: fileUrl,
                fileName: result.name,
                fileSize: result.sizeOriginal,
                mimeType: result.mimeType,
                uploadedAt: result.$createdAt
            });

        } catch (uploadError) {
            console.error('Upload failed:', uploadError);
            console.error('Upload error details:', {
                message: uploadError.message,
                code: uploadError.code,
                type: uploadError.type,
                response: uploadError.response
            });
            
            // Try alternative permissions format if the first one fails
            console.log('Trying alternative permissions format...');
            try {
                const fileBlob2 = new Blob([req.file.buffer], { type: req.file.mimetype });
                const fileObject2 = new File([fileBlob2], req.file.originalname, { 
                    type: req.file.mimetype,
                    lastModified: Date.now()
                });

                const result2 = await storage.createFile(
                    IMAGE_BUCKET_ID,
                    fileId,
                    fileObject2,
                    [Permission.read(Role.users())] // Alternative: logged in users
                );

                console.log('Upload with alternative permissions successful:', result2.$id);

                const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${IMAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}&mode=admin`;

                res.json({
                    success: true,
                    fileId: result2.$id,
                    url: fileUrl,
                    fileName: result2.name,
                    fileSize: result2.sizeOriginal,
                    mimeType: result2.mimeType,
                    uploadedAt: result2.$createdAt
                });

            } catch (alternativeError) {
                console.error('Alternative permissions also failed:', alternativeError);
                
                // Final attempt: no permissions (rely on bucket settings)
                console.log('Trying upload without explicit permissions...');
                try {
                    const fileBlob3 = new Blob([req.file.buffer], { type: req.file.mimetype });
                    const fileObject3 = new File([fileBlob3], req.file.originalname, { 
                        type: req.file.mimetype,
                        lastModified: Date.now()
                    });

                    const result3 = await storage.createFile(
                        IMAGE_BUCKET_ID,
                        fileId,
                        fileObject3
                        // No permissions - rely on bucket configuration
                    );

                    console.log('Upload without explicit permissions successful:', result3.$id);

                    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${IMAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}&mode=admin`;

                    res.json({
                        success: true,
                        fileId: result3.$id,
                        url: fileUrl,
                        fileName: result3.name,
                        fileSize: result3.sizeOriginal,
                        mimeType: result3.mimeType,
                        uploadedAt: result3.$createdAt
                    });

                } catch (finalError) {
                    console.error('All upload attempts failed:', finalError);
                    throw finalError;
                }
            }
        }

    } catch (error) {
        console.error('Error in upload process:', error);
        res.status(500).json({
            error: error.message,
            details: error.response || 'No additional details',
            type: error.type || 'Unknown error type'
        });
    }
});

// Check SDK version endpoint
router.get('/sdk-info', (req, res) => {
    try {
        const packageJson = require('../../package.json');
        const appwriteVersion = packageJson.dependencies?.['node-appwrite'] || 'Not found';
        
        console.log('Appwrite SDK version:', appwriteVersion);
        
        res.json({
            appwriteVersion,
            nodeVersion: process.version,
            message: 'SDK info retrieved'
        });
    } catch (error) {
        res.json({
            error: 'Could not read SDK version',
            nodeVersion: process.version
        });
    }
});

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
        
        const menuId = newItem.menu_id || ID.unique();
        const documentData = {
            ...newItem,
            menu_id: menuId
        };
        
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                MENU_COLLECTION_ID,
                ID.unique(),
                documentData
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
            []
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