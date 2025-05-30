import React, { useState, useEffect, useRef } from 'react';
import { 
    Container, Grid, Button, Box, TextField, FormControl,
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Switch, FormControlLabel,
    CircularProgress, Alert, Card, CardContent, CardMedia, CardActions
} from '@mui/material';
import { ID } from 'appwrite';
import { createMenuItem, getAllMenuItems, uploadMenuImage } from '../services/menuApi';

const Menu = () => {
    const [menuItem, setMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        ingredients: '',
        side_dishes: [],
        image_url: '',
        availability: true,
        branch_id: ''
    });

    const [menuItems, setMenuItems] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await getAllMenuItems();
                setMenuItems(items);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };
        fetchMenuItems();
    }, []);

    const [sideDish, setSideDish] = useState({ name: '', price: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMenuItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSideDishChange = (e) => {
        const { name, value } = e.target;
        setSideDish(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSideDish = () => {
        if (sideDish.name && sideDish.price) {
            setMenuItem(prev => ({
                ...prev,
                side_dishes: [...prev.side_dishes, sideDish]
            }));
            setSideDish({ name: '', price: '' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('File selected:', file);
        if (file) {
            setSelectedFile(file);
            
            // Create a preview URL for the image
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setImagePreview(fileReader.result);
                console.log('Image preview created');
            };
            fileReader.readAsDataURL(file);
        }
    };

    const uploadImageToAppwrite = async (file) => {
        console.log('Starting image upload to Appwrite...');
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
            
            const response = await uploadMenuImage(formData);
            console.log('Upload response received:', response);
            
            if (!response.url) {
                console.error('No URL in response:', response);
                throw new Error('No URL returned from upload');
            }
            
            console.log('Image uploaded successfully. URL:', response.url);
            return response.url;
            
        } catch (error) {
            console.error('Error uploading image to Appwrite:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', menuItem);
        
        try {
            setUploading(true);
            setUploadStatus({ type: 'info', message: 'Processing menu item...' });
            
            let imageUrl = '';
            
            // If a file is selected, upload it first
            if (selectedFile) {
                console.log('File selected, uploading to Appwrite...');
                setUploadStatus({ type: 'info', message: 'Uploading image to Appwrite...' });
                
                try {
                    imageUrl = await uploadImageToAppwrite(selectedFile);
                    console.log('Image upload successful. Final URL:', imageUrl);
                    setUploadStatus({ type: 'success', message: 'Image uploaded successfully!' });
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    setUploadStatus({ 
                        type: 'error', 
                        message: 'Failed to upload image: ' + (uploadError.response?.data?.error || uploadError.message) 
                    });
                    setUploading(false);
                    return; // Stop execution if image upload fails
                }
            } else {
                console.log('No file selected, using placeholder image');
                imageUrl = 'https://NO_URL_ADDRESS';
            }
            
            console.log('Using final image URL:', imageUrl);
            
            // Create the menu item with the uploaded image URL
            const formattedMenuItem = {
                ...menuItem,
                price: parseFloat(menuItem.price),
                ingredients: menuItem.ingredients,
                image_url: imageUrl,
                menu_id: ID.unique()
            };
            
            console.log('Creating menu item with formatted data:', formattedMenuItem);
            setUploadStatus({ type: 'info', message: 'Creating menu item...' });
            
            const response = await createMenuItem(formattedMenuItem);
            console.log('Menu item created successfully:', response);
            
            setUploadStatus({ type: 'success', message: 'Menu item added successfully!' });
    
            // Clear form after successful submission
            setMenuItem({
                name: '',
                description: '',
                price: '',
                category: '',
                ingredients: '',
                side_dishes: [],
                image_url: '',
                availability: true,
                branch_id: ''
            });
            
            // Reset file input and preview
            setSelectedFile(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
            // Refresh menu items list
            try {
                const items = await getAllMenuItems();
                setMenuItems(items);
                console.log('Menu items list refreshed');
            } catch (fetchError) {
                console.error('Error refreshing menu items:', fetchError);
            }
            
            setTimeout(() => {
                setUploadStatus(null);
            }, 3000);
            
        } catch (error) {
            console.error('Error in form submission:', error);
            console.error('Error details:', error.response?.data);
            setUploadStatus({ 
                type: 'error', 
                message: 'Error adding menu item: ' + (error.response?.data?.error || error.message) 
            });
        } finally {
            setUploading(false);
        }
    };

    // Define a fallback image URL
    const fallbackImageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <>
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Add New Menu Item
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={menuItem.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                name="description"
                                value={menuItem.description}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={menuItem.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Category"
                                name="category"
                                value={menuItem.category}
                                onChange={handleInputChange}
                                
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ingredients (comma-separated)"
                                name="ingredients"
                                value={menuItem.ingredients}
                                onChange={handleInputChange}
                                
                            />
                        </Grid>
                        
                        {/* Image Upload Section */}
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Menu Item Image
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="menu-image-upload"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ marginBottom: '10px', display: 'block' }}
                                />
                                
                                {/* Display the current file name */}
                                {selectedFile && (
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Selected file: {selectedFile.name}
                                    </Typography>
                                )}
                                
                                {/* Display image preview */}
                                {imagePreview && (
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '200px',
                                                objectFit: 'contain',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px'
                                            }} 
                                        />
                                    </Box>
                                )}

                                 {/* Display existing image if available */}
                                {menuItems.image_url && !imagePreview && (
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <img 
                                            src={menuItem.image_url} 
                                            alt={menuItem.name} 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '200px',
                                                borderRadius: '4px',
                                                objectFit: 'cover'
                                            }} 
                                        />
                                    </Box>
                                )}
                                 
                                {/* Display upload status */}
                                {uploadStatus && (
                                    <Alert 
                                        severity={uploadStatus.type} 
                                        sx={{ mt: 2 }}
                                        onClose={() => setUploadStatus(null)}
                                    >
                                        {uploadStatus.message}
                                    </Alert>
                                )}
                            </Box>
                        </Grid>
                        
                        {/* <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Branch ID"
                                name="branch_id"
                                value={menuItem.branch_id}
                                onChange={handleInputChange}
                                
                            />
                        </Grid> */}
                        {/* <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={menuItem.availability}
                                        onChange={(e) => setMenuItem(prev => ({
                                            ...prev,
                                            availability: e.target.checked
                                        }))}
                                        name="availability"
                                    />
                                }
                                label="Available"
                            />
                        </Grid> */}

                        {/* Side Dishes Section
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Add Side Dishes
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        fullWidth
                                        label="Side Dish Name"
                                        value={sideDish.name}
                                        onChange={handleSideDishChange}
                                        name="name"
                                    />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        fullWidth
                                        label="Side Dish Price"
                                        type="number"
                                        value={sideDish.price}
                                        onChange={handleSideDishChange}
                                        name="price"
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <Button
                                        variant="contained"
                                        onClick={addSideDish}
                                        fullWidth
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid> */}

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <CircularProgress size={24} sx={{ mr: 1 }} />
                                        Processing...
                                    </>
                                ) : (
                                    'Add Menu Item'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>


            
        </Container>
        </>
    );
};

export default Menu;
