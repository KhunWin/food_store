import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Layout from './components/Layout';
import AdminLogin from './components/AdminLogin';
import Menu from './components/Menu';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        {/* <AdminLogin /> */}
        <Menu />
      </Layout>
    </ThemeProvider>
  );
}

export default App;