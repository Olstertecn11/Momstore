import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact"; // crea este archivo
import Layout from "./components/Layout";
import "./assets/style/main.css";

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
  return <RouterManager />;
}
