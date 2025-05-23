import { Container, Box } from '@mui/material';

const Layout = ({ children }) => (
  <Container maxWidth="lg">
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      {children}
    </Box>
  </Container>
);

export default Layout;