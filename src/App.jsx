import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact"; // crea este archivo
import Layout from "./components/Layout";
import "./assets/style/main.css";
import { CartProvider } from "./store/cart.context";
import Cart from "./pages/Cart";
import Order from "./pages/Order";

function RouterManager() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout navbarInsideChild>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/Productos"
          element={
            <Layout navbarDarkmode>
              <Products />
            </Layout>
          }
        />
        <Route
          path="/Carrito"
          element={
            <Layout navbarDarkmode>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/pedido/:code"
          element={
            <Layout navbarDarkmode>
              <Order />
            </Layout>
          }
        />
        <Route
          path="/Contacto"
          element={
            <Layout navbarDarkmode>
              <Contact />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <CartProvider>
      <RouterManager />
    </CartProvider>
  );
}
