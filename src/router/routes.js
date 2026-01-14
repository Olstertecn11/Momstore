import Home from "../pages/Home";
import Products from "../pages/Products";
import Contact from "../pages/Contact";
import Order from "../pages/Order";
import Cart from "../pages/Cart";

import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminOrders from "../pages/admin/Orders";

const routes = {
  publicRoutes: [
    { path: "/", component: Home, layout: { use: true, props: { navbarInsideChild: true } }, default: true },
    { path: "/productos", component: Products, layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },
    { path: "/carrito", component: Cart, layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },
    { path: "/pedido/:code", component: Order, layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },
    { path: "/contacto", component: Contact, layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },

    { path: "/admin/inicio-sesion", component: Login, layout: { use: false, props: {} } },
  ],

  adminRoutes: [
    { path: "/admin/dashboard", component: AdminDashboard, roles: ["Administrador", "Cliente"], layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },
    { path: "/admin/ordenes", component: AdminOrders, roles: ["Administrador", "Cliente"], layout: { use: true, props: { navbarInsideChild: false, navbarDarkmode: true } } },
  ],
};

export default routes;
