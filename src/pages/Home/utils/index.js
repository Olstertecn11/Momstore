export const normalizeProduct = (p) => {
  const price = typeof p.price === "number"
    ? p.price
    : Number(String(p.price).replace(",", "."));

  return {
    id: p.id_product,
    name: p.name ?? "",
    description: p.description ?? "",
    price: Number.isFinite(price) ? price : 0,
    imageUrl: p.image_url || "",
    stock: typeof p.stock === "number" ? p.stock : Number(p.stock || 0),
    categoryId: p.id_category_fk,
  };
};
