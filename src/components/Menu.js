import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Classic Burger', description: 'Juicy beef patty with fresh veggies', price: 8.99 },
    { id: 2, name: 'Margherita Pizza', description: 'Tomato, mozzarella, and basil', price: 12.99 },
    { id: 3, name: 'Caesar Salad', description: 'Romaine lettuce, croutons, and parmesan', price: 7.99 },
    { id: 4, name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with vanilla ice cream', price: 6.99 }
  ]);

  return (
    <Grid container spacing={3}>
      {menuItems.map(item => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">{item.description}</Typography>
              <Typography variant="body1">${item.price.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Menu;