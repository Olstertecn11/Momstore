import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Flex,
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
import hero_bg from "../../assets/images/home_background.jpg";
import environment from "../../config/environment";
import { useCart } from "../../store/cart.context";
import ProductCard from "../../components/common/ProductCard";
import FeatureCard from './FeatureCard'
import WaveText from "../../components/common/WaveText";

import { normalizeProduct } from './utils'


export default function Home({ navbar }) {
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState("");

  const heroMinH = useBreakpointValue({ base: "560px", md: "640px" });


  const { addItem } = useCart();

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

      <Box h={'60vh'} w={'full'} bg={'linear-gradient(to right top, #5e694c, #717e62, #85947a, #9aab91, #afc2aa, #b2c9ac, #b4d0ae, #b7d7b0, #aacf9a, #9fc683, #95bd6b, #8db352);'} >

        <Flex
          justifyContent='center'
          alignItems='center'
          alignContent='center'
          justifyItems='center'
          h='100%'
          w='100%'
          flexDirection='column'
          paddingX={'2rem'}
        >
          <WaveText
            text="Cocina con propósito, come con placer,"
            color="white"
            fontWeight="800"
            lineHeight="1.05"
            fontSize={{ base: "40px", md: "70px" }}
          />
          <WaveText
            text="vive con energía."
            color="white"
            fontWeight="800"
            lineHeight="1.05"
            fontSize={{ base: "40px", md: "70px" }}
          />
        </Flex>

      </Box>

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
              <ProductCard key={p.id} product={p} onOpenCatalog={handleGoCatalog} addProduct={addItem} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
}


