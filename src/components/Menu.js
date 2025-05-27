import React, { useState, useEffect } from 'react';
import { 
    Container, Grid, Button, Box, TextField, FormControl,
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography, Switch, FormControlLabel
} from '@mui/material';
import { ID } from 'appwrite';
import { createMenuItem, getAllMenuItems } from '../services/menuApi';


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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', menuItem);
        
        try {
            const formattedMenuItem = {
                ...menuItem,
                price: parseFloat(menuItem.price),
                ingredients: menuItem.ingredients,
                menu_id: ID.unique()
            };
            
            console.log('Formatted menu item:', formattedMenuItem);
            
            const response = await createMenuItem(formattedMenuItem);
            console.log('Successfully added menu item:', response);

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

            alert('Menu item added successfully!');
        } catch (error) {
            console.error('Error in form submission:', error);
            alert('Error adding menu item. Please try again.');
        }
    };

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
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ingredients (comma-separated)"
                                name="ingredients"
                                value={menuItem.ingredients}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Image URL"
                                name="image_url"
                                value={menuItem.image_url}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Branch ID"
                                name="branch_id"
                                value={menuItem.branch_id}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>

                        {/* Side Dishes Section */}
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
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                            >
                                Add Menu Item
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>

        {/* <Container maxWidth="lg" sx={{ mt: 4 }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Availability</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.$id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>${item.price}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>
                                    {item.availability ? 'Available' : 'Not Available'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container> */}
        </>

        
    );
};

export default Menu;