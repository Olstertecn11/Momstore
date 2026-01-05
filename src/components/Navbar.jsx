import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// Si usas react-router-dom, descomenta esto:
// import { Link as RouterLink } from "react-router-dom";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Ofertas", href: "#" },
  { label: "Contáctanos", href: "#" },
];

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      w="100%"
      h="70px"
      zIndex="100"
      bg="rgba(255,255,255,0.18)"
      boxShadow="sm"
      sx={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <Flex
        maxW="1200px"
        h="100%"
        mx="auto"
        px={{ base: 4, md: 6 }}
        align="center"
        justify="space-between"
      >
        {/* LOGO */}
        <Text
          fontSize="lg"
          fontWeight="700"
          color="#111"
          letterSpacing="0.03em"
        >
          MomStore
        </Text>

        {/* MENÚ DESKTOP */}
        <HStack
          as="ul"
          spacing={6}
          display={{ base: "none", md: "flex" }}
          listStyleType="none"
        >
          {navLinks.map((item) => (
            <Box as="li" key={item.label}>
              <Link
                // Si usas react-router-dom:
                // as={RouterLink}
                // to={item.href}
                href={item.href}
                fontSize="sm"
                fontWeight="500"
                color="#111"
                _hover={{ color: "#2a7a3b", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            </Box>
          ))}
        </HStack>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <IconButton
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          icon={isOpen ? <CloseIcon boxSize={3} /> : <HamburgerIcon boxSize={5} />}
          variant="ghost"
          display={{ base: "flex", md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
      </Flex>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <Box
          bg="rgba(255,255,255,0.98)"
          borderTop="1px solid rgba(0,0,0,0.06)"
          boxShadow="md"
          display={{ base: "block", md: "none" }}
        >
          <Stack as="ul" listStyleType="none" spacing={1} py={3} px={4}>
            {navLinks.map((item) => (
              <Box as="li" key={item.label}>
                <Link
                  // as={RouterLink}
                  // to={item.href}
                  href={item.href}
                  display="block"
                  py={2}
                  fontSize="sm"
                  fontWeight="500"
                  color="#111"
                  _hover={{ color: "#2a7a3b", textDecoration: "none" }}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
