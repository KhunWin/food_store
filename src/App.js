import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Layout from './components/Layout';
import AdminLogin from './components/AdminLogin';
import Menu from './components/Menu';
import LandingPage from './components/LandingPage';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        {/* <AdminLogin /> */}
        <Menu />
        {/* <LandingPage /> */}
      </Layout>
    </ThemeProvider>
  );
}

export default App;