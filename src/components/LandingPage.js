import { Box, Typography, Container, Grid, Paper, Button } from '@mui/material';
// import RestaurantIcon from '@mui/icons-material/Restaurant';

const menuItems = [
  {
    name: "Truffle Pasta",
    price: "$24",
    description: "Fresh handmade pasta with black truffle and parmesan"
  },
  {
    name: "Wagyu Burger",
    price: "$28",
    description: "Premium wagyu beef with caramelized onions and special sauce"
  },
  {
    name: "Mediterranean Salad",
    price: "$16",
    description: "Fresh greens with feta, olives, and house dressing"
  },
  {
    name: "Seafood Risotto",
    price: "$32",
    description: "Creamy arborio rice with fresh seafood and herbs"
  }
];

const LandingPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {/* <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} /> */}
          <Typography variant="h2" component="h1" gutterBottom>
            Delicious Flavors
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Experience culinary excellence in every bite
          </Typography>
          <Button variant="contained" size="large" sx={{ mt: 2 }}>
            View Full Menu
          </Button>
        </Box>

        {/* Featured Menu */}
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Featured Dishes
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.name}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography color="primary" variant="h5" gutterBottom>
                  {item.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;