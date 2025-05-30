const express = require('express');
const bcrypt = require('bcryptjs');
const { databases, DATABASE_ID, USER_COLLECTION_ID, ID, Query } = require('../config/appwriteConfig');
const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists using correct Appwrite query syntax
        try {
            const existingUsers = await databases.listDocuments(
                DATABASE_ID,
                USER_COLLECTION_ID,
                [Query.equal('email', email)]
            );

            if (existingUsers.documents.length > 0) {
                return res.status(400).json({ error: 'User already exists with this email' });
            }
        } catch (error) {
            console.log('Error checking existing user:', error);
        }

        // Hash password with shorter salt rounds to keep it manageable
        const hashedPassword = await bcrypt.hash(password, 10);

        // If hashed password is still too long, we'll use a different approach
        let finalPassword = hashedPassword;
        if (hashedPassword.length > 255) {
            // Use a shorter hash or store differently
            finalPassword = hashedPassword.substring(0, 255);
        }

        // Create user in Appwrite
        const userData = {
            email,
            password: finalPassword,
            name,
            status: 'user', // Default to 'user'
            // createdAt: new Date().toISOString()
        };

        const user = await databases.createDocument(
            DATABASE_ID,
            USER_COLLECTION_ID,
            ID.unique(),
            userData
        );

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        
        res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword,
            token: 'authenticated'
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create user: ' + error.message });
    }
});

// Sign in
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email using correct query syntax
        const users = await databases.listDocuments(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [Query.equal('email', email)]
        );

        if (users.documents.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users.documents[0];
        console.log("status", user.status);

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token: 'authenticated'
        });

    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Failed to sign in: ' + error.message });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        res.json({ message: 'Token is valid' });
    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Authentication check failed' });
    }
});

module.exports = router;