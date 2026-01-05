import hero_bg from "../assets/images/home_background.jpg";
import "../assets/style/home.css";

const featuredProducts = [
  {
    id: 1,
    name: "Canasta de frutas frescas",
    description: "Selección de frutas de temporada, lista para disfrutar en desayunos y snacks.",
    price: "Q45.00",
    tag: "Saludable"
  },
  {
    id: 2,
    name: "Pack semanal de verduras",
    description: "Verduras frescas y listas para cocinar tus comidas caseras favoritas.",
    price: "Q60.00",
    tag: "Para la semana"
  },
  {
    id: 3,
    name: "Kit básico de despensa",
    description: "Productos esenciales para la alacena: pasta, granos, salsas y más.",
    price: "Q120.00",
    tag: "Despensa"
  },
  {
    id: 4,
    name: "Snacks saludables",
    description: "Snacks horneados, frutos secos y opciones ligeras para el día a día.",
    price: "Q35.00",
    tag: "Snacks"
  }
];

export default function Home({ navbar }) {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <img src={hero_bg} className="bg-hero" alt="MomStore hero" />

        {navbar}

        <div className="hero-content">
          <h1>
            Vive mejor,
            <br />
            cocina rico
            <br />
            y come sano.
          </h1>

          <p>
            Somos tu tienda de confianza en productos para el hogar y la cocina.
            Encuentra alimentos y artículos seleccionados para una vida más
            práctica, saludable y deliciosa.
          </p>

          <div className="hero-actions">
            <button className="btn primary">Comprar ahora</button>
            <button className="btn secondary">Ver catálogo</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-inner">
          <h2>¿Por qué comprar con nosotros?</h2>
          <p className="features-subtitle">
            Hacemos tus compras del hogar más fáciles, rápidas y pensadas para tu bienestar.
          </p>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>Productos seleccionados</h3>
              <p>
                Elegimos cuidadosamente cada producto para ofrecerte calidad, sabor
                y opciones que se adaptan a tu estilo de vida.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🥦</div>
              <h3>Enfoque en lo saludable</h3>
              <p>
                Impulsamos una alimentación más sana sin dejar de lado lo rico:
                frutas, verduras, snacks y básicos para cocinar en casa.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Comodidad hasta tu puerta</h3>
              <p>
                Pide desde tu celular y recibe en tu casa, sin filas ni tráfico.
                Tú eliges, nosotros nos encargamos del resto.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* PRODUCTS / CATÁLOGO DESTACADO */}
      <section className="products" id="products">
        <div className="products-inner">
          <div className="products-header">
            <div>
              <h2>Productos destacados</h2>
              <p>
                Explora algunas de las opciones que tenemos para ti. Muy pronto
                podrás ver el catálogo completo y hacer tu pedido en línea.
              </p>
            </div>
            <button className="btn outline">Ver todos los productos</button>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-tag">{product.tag}</div>
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <button className="btn product-btn">Agregar</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
