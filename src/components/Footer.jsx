import React from "react";
import { Box, Container, SimpleGrid, Heading, Text, HStack, Button, Divider } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Box bg="gray.900" color="whiteAlpha.900" mt={10}>
      <Container maxW="6xl" py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box>
            <Heading size="sm" mb={3} color="white">
              NutriHome
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.700">
              Tienda familiar con productos seleccionados para tu hogar y cocina.
              Pide en línea y coordinamos tu entrega.
            </Text>
          </Box>

          <Box>
            <Heading size="sm" mb={3} color="white">
              Navegación
            </Heading>
            <HStack spacing={3} flexWrap="wrap">
              <Button as={Link} to="/" size="sm" variant="ghost" color="whiteAlpha.900">
                Inicio
              </Button>
              <Button as={Link} to="/Productos" size="sm" variant="ghost" color="whiteAlpha.900">
                Productos
              </Button>
              <Button as={Link} to="/Contacto" size="sm" variant="ghost" color="whiteAlpha.900">
                Contacto
              </Button>
            </HStack>
          </Box>

          <Box>
            <Heading size="sm" mb={3} color="white">
              Contacto
            </Heading>
            <Text fontSize="sm" color="whiteAlpha.700">
              WhatsApp: +502 4620-4465
            </Text>
            <Text fontSize="sm" color="whiteAlpha.700">
              Email: info@nutrihome.com
            </Text>

            <Button
              as="a"
              href="https://wa.me/50246204465"
              target="_blank"
              rel="noreferrer"
              mt={4}
              p={5}
              size="sm"
              borderRadius="full"
              bg="#88ad40"
              color="white"
              _hover={{ bg: "#667e37" }}
            >
              Escribir por WhatsApp
            </Button>
          </Box>
        </SimpleGrid>

        <Divider my={8} borderColor="whiteAlpha.200" />

        <Text fontSize="xs" color="whiteAlpha.600">
          © {new Date().getFullYear()} NutriHome. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  );
}
