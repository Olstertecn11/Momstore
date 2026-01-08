import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  Button,
  SimpleGrid,
  Badge,
  Image,
  Skeleton,
  SkeletonText,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import hero_bg from "../assets/images/home_background.jpg";
import environment from "../config/environment";

const normalizeProduct = (p) => {
  const price =
    typeof p.price === "number" ? p.price : Number(String(p.price).replace(",", "."));

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

export default function Home({ navbar }) {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState("");

  const heroMinH = useBreakpointValue({ base: "560px", md: "640px" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeatured() {
      try {
        setLoadingFeatured(true);
        setErrorFeatured("");

        const res = await fetch(`${environment.config.apiUrl}/products`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status} cargando productos`);

        const data = await res.json();
        const products = (Array.isArray(data) ? data : []).map(normalizeProduct);

        const withStock = products.filter((p) => p.stock > 0);
        const noStock = products.filter((p) => p.stock <= 0);

        setFeatured([...withStock, ...noStock].slice(0, 4));
      } catch (err) {
        if (err.name !== "AbortError") {
          setErrorFeatured(err.message || "Error cargando destacados");
        }
      } finally {
        setLoadingFeatured(false);
      }
    }

    loadFeatured();
    return () => controller.abort();
  }, []);

  const handleScrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGoCatalog = () => {
    navigate("/Productos");
    // Si NO usas react-router:
    // window.location.href = "/Productos";
  };

  const featuredSubtitle = useMemo(() => {
    if (loadingFeatured) return "Cargando productos destacados…";
    if (errorFeatured) return "No pudimos cargar los productos destacados.";
    if (!featured.length) return "Aún no hay productos para mostrar.";
    return "Explora algunas de las opciones que tenemos para ti.";
  }, [loadingFeatured, errorFeatured, featured.length]);

  return (
    <Box bg="gray.50">
      {/* HERO */}
      <Box position="relative" minH={heroMinH} overflow="hidden">
        {/* Fondo */}
        <Image
          src={hero_bg}
          alt="MomStore hero"
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        {/* Overlay para legibilidad */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-b, blackAlpha.700, blackAlpha.600, blackAlpha.900)"
        />

        {/* Navbar (prop) */}
        <Box position="relative" zIndex={3}>
          {navbar}
        </Box>

        {/* Contenido */}
        <Container position="relative" zIndex={2} maxW="6xl" pt={{ base: 16, md: 24 }} pb={14}>
          <Stack spacing={6} maxW="720px">
            <Badge
              alignSelf="flex-start"
              px={3}
              py={1}
              borderRadius="full"
              bg="whiteAlpha.200"
              color="white"
              fontSize="xs"
              backdropFilter="blur(10px)"
            >
              Tienda familiar • Productos seleccionados
            </Badge>

            <Heading
              color="white"
              fontWeight="800"
              lineHeight="1.05"
              fontSize={{ base: "38px", md: "56px" }}
            >
              Vive mejor,
              <br />
              cocina rico
              <br />
              y come sano.
            </Heading>

            <Text color="whiteAlpha.900" fontSize={{ base: "sm", md: "md" }} maxW="640px">
              Somos tu tienda de confianza en productos para el hogar y la cocina. Encuentra
              alimentos y artículos seleccionados para una vida más práctica, saludable y deliciosa.
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <Button
                onClick={handleScrollToProducts}
                bg="#88ad40"
                color="white"
                _hover={{ bg: "#667e37" }}
                borderRadius="full"
                px={7}
              >
                Comprar ahora
              </Button>
              <Button
                onClick={handleGoCatalog}
                variant="outline"
                color="white"
                borderColor="whiteAlpha.500"
                _hover={{ bg: "whiteAlpha.200" }}
                borderRadius="full"
                px={7}
              >
                Ver catálogo
              </Button>
            </HStack>

            <HStack spacing={4} flexWrap="wrap" color="whiteAlpha.900" fontSize="sm">
              <HStack spacing={2}>
                <Box as="span">✅</Box>
                <Text>Productos seleccionados</Text>
              </HStack>
              <HStack spacing={2}>
                <Box as="span">🚚</Box>
                <Text>Entrega coordinada</Text>
              </HStack>
              <HStack spacing={2}>
                <Box as="span">💬</Box>
                <Text>Atención por WhatsApp</Text>
              </HStack>
            </HStack>
          </Stack>
        </Container>
      </Box>

      {/* FEATURES */}
      <Container maxW="6xl" py={{ base: 10, md: 14 }}>
        <Stack spacing={4} mb={8} textAlign={{ base: "left", md: "center" }}>
          <Heading size="lg" color="#1b2b1f">
            ¿Por qué comprar con nosotros?
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Hacemos tus compras del hogar más fáciles, rápidas y pensadas para tu bienestar.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <FeatureCard
            icon="🛒"
            title="Productos seleccionados"
            desc="Elegimos cuidadosamente cada producto para ofrecerte calidad y opciones que se adapten a tu estilo de vida."
          />
          <FeatureCard
            icon="🥦"
            title="Enfoque en lo saludable"
            desc="Impulsamos una alimentación más sana sin dejar de lado lo rico: snacks, básicos y productos para cocinar."
          />
          <FeatureCard
            icon="🚚"
            title="Comodidad hasta tu puerta"
            desc="Pide desde tu celular y recibe en tu casa, sin filas ni tráfico. Tú eliges, nosotros lo preparamos."
          />
        </SimpleGrid>
      </Container>

      <Divider />

      {/* DESTACADOS */}
      <Container maxW="6xl" py={{ base: 10, md: 14 }} id="products">
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          spacing={4}
          mb={6}
        >
          <Box>
            <Heading size="lg" color="#1b2b1f">
              Productos destacados
            </Heading>
            <Text color="gray.600" fontSize="sm" mt={1}>
              {featuredSubtitle}
            </Text>

            {errorFeatured ? (
              <Text mt={2} color="red.600" fontSize="sm">
                {errorFeatured} — verifica que tu API esté en {environment.config.apiUrl}
              </Text>
            ) : null}
          </Box>

          <Button
            onClick={handleGoCatalog}
            variant="outline"
            borderRadius="full"
            color="#1b2b1f"
            borderColor="blackAlpha.300"
            _hover={{ bg: "blackAlpha.50" }}
          >
            Ver todos los productos
          </Button>
        </Stack>

        {loadingFeatured ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} bg="white" borderRadius="2xl" boxShadow="sm" p={4}>
                <Skeleton h="150px" borderRadius="xl" />
                <SkeletonText mt="4" noOfLines={3} spacing="3" />
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5}>
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} onOpenCatalog={handleGoCatalog} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
      <Box fontSize="28px" mb={3}>
        {icon}
      </Box>
      <Heading size="sm" color="#1b2b1f" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {desc}
      </Text>
    </Box>
  );
}

function ProductCard({ product, onOpenCatalog }) {
  const available = product.stock > 0;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      p={4}
      cursor="pointer"
      onClick={onOpenCatalog}
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      transition="all 0.2s ease"
    >
      <Box position="relative" borderRadius="xl" overflow="hidden" bg="gray.50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          w="100%"
          h="150px"
          objectFit="cover"
          fallback={<Box h="150px" />}
        />
        <Badge
          position="absolute"
          top="10px"
          left="10px"
          borderRadius="full"
          px={3}
          py={1}
          bg="blackAlpha.600"
          color="white"
          backdropFilter="blur(10px)"
          fontSize="xs"
        >
          {available ? "Disponible" : "Agotado"}
        </Badge>
      </Box>

      <Heading size="sm" color="#1b2b1f" mt={3} noOfLines={2}>
        {product.name}
      </Heading>
      <Text fontSize="xs" color="gray.600" mt={1} noOfLines={2}>
        {product.description}
      </Text>

      <HStack justify="space-between" mt={3}>
        <Text fontWeight="bold" color="#1b2b1f">
          Q{product.price.toFixed(2)}
        </Text>

        <Button
          size="sm"
          borderRadius="full"
          bg="#88ad40"
          color="white"
          _hover={{ bg: "#667e37" }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenCatalog();
          }}
          isDisabled={!available}
        >
          {available ? "Agregar" : "Ver"}
        </Button>
      </HStack>
    </Box>
  );
}
