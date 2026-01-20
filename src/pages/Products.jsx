import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Badge,
  Button,
  HStack,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Image,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import "../assets/style/products.css";
import { useCart } from "../store/cart.context";
import environment from "../config/environment";
import { api } from "../api/axios";

const normalizeProduct = (p) => {
  const priceNumber =
    typeof p.price === "number" ? p.price : Number(String(p.price).replace(",", "."));

  return {
    id: p.id_product,
    name: p.name ?? "",
    description: p.description ?? "",
    price: Number.isFinite(priceNumber) ? priceNumber : 0,
    unit: "Q",
    categoryId: p.id_category_fk,
    imageUrl: p.image_url || "",
    stock: typeof p.stock === "number" ? p.stock : Number(p.stock || 0),
  };
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all"); // "all" o id numérico en string
  const [fetchedCategories, setFetchedCategories] = useState([]);

  const [sort, setSort] = useState("recomendados");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addItem } = useCart();

  // =========================
  // Fetch productos
  // =========================
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setErrorMsg("");

        const url = `${environment.config.apiUrl}/products`;

        // Ejecutamos ambas peticiones
        const [res, catRes] = await Promise.all([
          fetch(url, { signal: controller.signal }),
          api.get("/categories")
        ]);

        if (!res.ok) throw new Error(`Error al cargar productos`);

        // 2. Corrección en la validación de axios (catRes)
        if (catRes.status !== 200) throw new Error(`Error al cargar categorías`);

        const data = await res.json();
        const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];

        setProducts(normalized);
        // Guardamos las categorías que vienen de la DB
        setFetchedCategories(catRes.data);

      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorMsg(err.message || "Error cargando datos");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const categoriesOptions = useMemo(() => {
    const base = [{ value: "all", label: "Todas las categorías" }];

    // 3. Mapeamos los datos de la DB al formato del Select
    const dbCategories = fetchedCategories.map((cat) => ({
      value: String(cat.id_category), // Aseguramos que sea string para el Select
      label: cat.category,
    }));

    return [...base, ...dbCategories];
  }, [fetchedCategories]);

  // =========================
  // Filtrado + Orden
  // =========================
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // búsqueda
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    // categoría (Filtro por el ID que viene de la DB)
    if (category !== "all") {
      const catId = Number(category);
      result = result.filter((p) => p.categoryId === catId);
    }

    // ordenamiento
    if (sort === "precio_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "precio_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, category, sort]);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedProduct(null);
  };

  return (
    <Box className="products-page">
      <Container maxW="6xl">
        {/* Encabezado */}
        <Stack spacing={4} mb={8}>
          <Heading size="lg" color="#1b2b1f">
            Nuestro catálogo
          </Heading>
          <Text fontSize="sm" color="#555" maxW="540px">
            Encuentra productos para tu hogar y cocina. Filtra por categoría o busca por
            nombre para encontrar lo que necesitas.
          </Text>
        </Stack>

        {/* Estado: error */}
        {errorMsg ? (
          <Box mb={6} p={4} bg="red.50" border="1px solid" borderColor="red.200" borderRadius="lg">
            <Text fontSize="sm" color="red.700">
              {errorMsg}
            </Text>
            <Text fontSize="xs" color="red.600" mt={1}>
              Verifica que tu API esté corriendo en {environment.config.apiUrl}
            </Text>
          </Box>
        ) : null}

        {/* Filtros */}
        <Stack
          className="products-filters"
          direction={{ base: "column", md: "row" }}
          spacing={4}
          mb={8}
        >
          <InputGroup maxW={{ base: "100%", md: "280px" }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              fontSize="sm"
            />
          </InputGroup>

          <Select
            maxW={{ base: "100%", md: "220px" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            bg="white"
            fontSize="sm"
          >
            {categoriesOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </Select>

          <Select
            maxW={{ base: "100%", md: "220px" }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            bg="white"
            fontSize="sm"
          >
            <option value="recomendados">Ordenar: Recomendados</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
          </Select>
        </Stack>

        {/* Loading skeleton */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} bg="white" borderRadius="xl" boxShadow="sm" p={4}>
                <Skeleton height="140px" borderRadius="lg" />
                <SkeletonText mt="4" noOfLines={3} spacing="3" />
              </Box>
            ))}
          </SimpleGrid>
        ) : filteredProducts.length === 0 ? (
          <Box className="products-empty">
            <Text fontSize="sm" color="#555">
              No encontramos productos que coincidan con tu búsqueda.
            </Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
            spacing={5}
            className="products-grid"
          >
            {filteredProducts.map((product) => (
              <Box
                key={product.id}
                className="product-card"
                bg="white"
                borderRadius="xl"
                boxShadow="sm"
                p={4}
                cursor="pointer"
                onClick={() => handleOpenProduct(product)}
                _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                transition="all 0.2s ease"
              >
                <VStack align="flex-start" spacing={3}>
                  {/* Imagen */}
                  <Box w="100%" borderRadius="lg" overflow="hidden" bg="gray.50">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      w="100%"
                      h="140px"
                      objectFit="cover"
                      fallback={<Box h="140px" />}
                    />
                  </Box>

                  <HStack justify="space-between" w="100%">
                    <Badge
                      colorScheme={product.stock > 0 ? "green" : "red"}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="0.7rem"
                    >
                      {product.stock > 0 ? "Disponible" : "Agotado"}
                    </Badge>

                    <Text fontSize="xs" color="gray.500">
                      Cat. {product.categoryId}
                    </Text>
                  </HStack>

                  <Heading as="h3" size="sm" color="#1b2b1f" noOfLines={2}>
                    {product.name}
                  </Heading>

                  <Text fontSize="xs" color="#555" noOfLines={3}>
                    {product.description}
                  </Text>

                  <HStack justify="space-between" w="100%" pt={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {product.unit}
                      {product.price.toFixed(2)}
                    </Text>
                    <Button
                      size="xs"
                      borderRadius="full"
                      bg="#88ad40"
                      color="white"
                      _hover={{ bg: "#667e37" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProduct(product);
                      }}
                    >
                      Ver detalles
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="md">
          <ModalOverlay />
          <ModalContent className="product-modal">
            <ModalHeader>{selectedProduct ? selectedProduct.name : "Producto"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedProduct && (
                <Stack spacing={4}>
                  <Box w="100%" borderRadius="lg" overflow="hidden" bg="gray.50">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      w="100%"
                      h="180px"
                      objectFit="cover"
                      fallback={<Box h="180px" />}
                    />
                  </Box>

                  <HStack spacing={3}>
                    <Badge
                      colorScheme={selectedProduct.stock > 0 ? "green" : "red"}
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="0.7rem"
                    >
                      {selectedProduct.stock > 0 ? "Disponible" : "Agotado"}
                    </Badge>

                    <Text fontSize="xs" color="gray.500">
                      Categoría {selectedProduct.categoryId}
                    </Text>
                  </HStack>

                  <Text fontSize="sm" color="gray.400">
                    {selectedProduct.description}
                  </Text>

                  <Divider />

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.200">
                      Precio:
                    </Text>
                    <Text fontWeight="bold">
                      {selectedProduct.unit}
                      {selectedProduct.price.toFixed(2)}
                    </Text>
                  </HStack>

                  <Button
                    mt={2}
                    borderRadius="full"
                    bg="#88ad40"
                    color="white"
                    _hover={{ bg: "#667e37" }}
                    w="full"
                    onClick={() => {
                      addItem(selectedProduct);
                    }}
                    isDisabled={selectedProduct.stock <= 0}
                  >
                    Agregar a mi lista
                  </Button>

                  <Button variant="outline" borderRadius="full" size="sm" w="full">
                    Consultar por WhatsApp
                  </Button>
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
