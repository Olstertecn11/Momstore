import "./assets/style/main.css";
import { CartProvider } from "./store/cart.context";
import RouterManager from "./router";


export default function App() {
  return (
    <CartProvider>
      <RouterManager />
    </CartProvider>
  );
}
