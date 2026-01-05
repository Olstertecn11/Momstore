import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Products from './pages/Products';
import Layout from './components/Layout';
import './assets/style/main.css';



function RouterManager() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <Layout navbarInsideChild>
            <Home />
          </Layout>
        } />
        <Route path='/Productos' element={
          <Layout >
            <Products />
          </Layout>
        } />

      </Routes>
    </BrowserRouter>
  );
}



function App() {
  return <RouterManager />;
}

export default App
