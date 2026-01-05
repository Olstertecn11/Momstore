import React, { useMemo, useState } from "react";
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
  Tag,
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
  Badge,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import "../assets/style/products.css";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Canasta de frutas frescas",
    description: "Selección de frutas de temporada para desayunos y snacks saludables.",
    price: 45,
    unit: "Q",
    category: "Frutas y verduras",
    tag: "Saludable",
  },
  {
    id: 2,
    name: "Pack semanal de verduras",
    description: "Verduras frescas listas para cocinar durante toda la semana.",
    price: 60,
    unit: "Q",
    category: "Frutas y verduras",
    tag: "Para la semana",
  },
  {
    id: 3,
    name: "Kit básico de despensa",
    description: "Pasta, granos, salsas y otros esenciales para tu alacena.",
    price: 120,
    unit: "Q",
    category: "Despensa",
    tag: "Esenciales",
  },
  {
    id: 4,
    name: "Snacks horneados",
    description: "Snacks ligeros para el día a día, ideales para la oficina o el estudio.",
    price: 35,
    unit: "Q",
    category: "Snacks",
    tag: "Ligero",
  },
  {
    id: 5,
    name: "Combo desayuno saludable",
    description: "Avena, miel, fruta deshidratada y leche para empezar bien tu día.",
    price: 85,
    unit: "Q",
    category: "Desayuno",
    tag: "Saludable",
  },
  {
    id: 6,
    name: "Pack de limpieza para cocina",
    description: "Detergente, esponjas y limpiadores para mantener tu cocina impecable.",
    price: 75,
    unit: "Q",
    category: "Hogar y limpieza",
    tag: "Hogar",
  },
  {
    id: 7,
    name: "Bebidas sin azúcar surtidas",
    description: "Variedad de bebidas sin azúcar añadida para cuidar tu consumo diario.",
    price: 55,
    unit: "Q",
    category: "Bebidas",
    tag: "Sin azúcar",
  },
  {
    id: 8,
    name: "Pastas integrales surtidas",
    description: "Diferentes tipos de pasta integral para tus recetas favoritas.",
    price: 50,
    unit: "Q",
    category: "Despensa",
    tag: "Integral",
  },
];

const getCategories = () => {
  const set = new Set(ALL_PRODUCTS.map((p) => p.category));
  return ["Todas las categorías", ...Array.from(set)];
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las categorías");
  const [sort, setSort] = useState("recomendados");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const categories = useMemo(() => getCategories(), []);

  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // filtro por búsqueda
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // filtro por categoría
    if (category !== "Todas las categorías") {
      result = result.filter((p) => p.category === category);
    }

    // ordenamiento
    if (sort === "precio_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "precio_desc") {
      result.sort((a, b) => b.price - a.price);
    } // "recomendados" deja el orden base

    return result;
  }, [search, category, sort]);

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
            Encuentra productos para tu hogar y cocina con un enfoque en lo
            práctico, saludable y delicioso. Filtra por categoría o busca por
            nombre para encontrar lo que necesitas.
          </Text>
        </Stack>

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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <Box className="products-empty">
            <Text fontSize="sm" color="#555">
              No encontramos productos que coincidan con tu búsqueda. Prueba con
              otro término o categoría.
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
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s ease"
              >
                <VStack align="flex-start" spacing={2}>
                  <HStack justify="space-between" w="100%">
                    <Badge
                      colorScheme="green"
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="0.7rem"
                    >
                      {product.tag}
                    </Badge>
                    <Text className="product-category" fontSize="xs" color="gray.500">
                      {product.category}
                    </Text>
                  </HStack>

                  <Heading as="h3" size="sm" color="#1b2b1f">
                    {product.name}
                  </Heading>

                  <Text fontSize="xs" color="#555" noOfLines={3}>
                    {product.description}
                  </Text>

                  <HStack justify="space-between" w="100%" pt={2}>
                    <Text className="product-price" fontWeight="bold" fontSize="sm">
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

        {/* Modal de producto */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} isCentered size="md">
          <ModalOverlay />
          <ModalContent className="product-modal">
            <ModalHeader>
              {selectedProduct ? selectedProduct.name : "Producto"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedProduct && (
                <Stack spacing={4}>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme="green"
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      fontSize="0.7rem"
                    >
                      {selectedProduct.tag}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      {selectedProduct.category}
                    </Text>
                  </HStack>

                  <Text fontSize="sm" color="#444">
                    {selectedProduct.description}
                  </Text>

                  <Divider />

                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Precio aproximado:
                    </Text>
                    <Text className="product-price" fontWeight="bold">
                      {selectedProduct.unit}
                      {selectedProduct.price.toFixed(2)}
                    </Text>
                  </HStack>

                  <Text fontSize="xs" color="gray.500">
                    *Precios sujetos a cambios según disponibilidad y lote. El
                    total final se confirma al procesar tu pedido.
                  </Text>

                  <Button
                    mt={2}
                    borderRadius="full"
                    bg="#88ad40"
                    color="white"
                    _hover={{ bg: "#667e37" }}
                    w="full"
                  >
                    Agregar a mi lista
                  </Button>

                  <Button
                    variant="outline"
                    borderRadius="full"
                    size="sm"
                    w="full"
                  >
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
