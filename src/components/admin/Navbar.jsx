import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  HStack,
  chakra,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
  Heading,
  Button,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiBox, FiUsers, FiClipboard, FiPieChart, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";

// Enlaces específicos para administración
const adminLinks = [
  { label: "Dashboard", to: "/admin", icon: <FiPieChart /> },
  { label: "Productos", to: "/admin/productos", icon: <FiBox /> },
  { label: "Pedidos", to: "/admin/pedidos", icon: <FiClipboard /> },
  { label: "Usuarios", to: "/admin/usuarios", icon: <FiUsers /> },
];

export default function AdminNav() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      w="100%"
      zIndex="100"
      bg={scrolled ? "#2D3748" : "#1A202C"} // Tonos oscuros para diferenciar del sitio público
      color="white"
      h="70px"
      boxShadow="lg"
      transition="all 0.3s"
    >
      <Flex maxW="1400px" h="100%" mx="auto" px={6} align="center" justify="space-between">

        {/* LOGO ADMIN */}
        <HStack spacing={2} cursor="pointer" onClick={() => navigate("/admin")}>
          <Heading as="h1" fontSize="24px" fontWeight="800" letterSpacing="-0.02em">
            <chakra.span color="green.400">Nutri</chakra.span>
            <chakra.span color="whiteAlpha.900">Admin</chakra.span>
          </Heading>
        </HStack>

        {/* MENÚ DESKTOP */}
        <HStack spacing={8} display={{ base: "none", md: "flex" }}>
          {adminLinks.map((link) => (
            <Link
              key={link.label}
              as={RouterLink}
              to={link.to}
              display="flex"
              alignItems="center"
              fontSize="sm"
              fontWeight="600"
              _hover={{ color: "green.300", textDecoration: "none" }}
            >
              <Box mr={2}>{link.icon}</Box>
              {link.label}
            </Link>
          ))}
        </HStack>

        {/* PERFIL Y SALIR */}
        <HStack spacing={4}>
          <VStack spacing={0} align="flex-end" display={{ base: "none", lg: "flex" }}>
            <Text fontSize="xs" fontWeight="bold" color="green.300">ADMINISTRADOR</Text>
            <Text fontSize="sm" isTruncated maxW="150px">{user?.username || "Admin"}</Text>
          </VStack>

          <IconButton
            aria-label="Cerrar Sesión"
            icon={<FiLogOut />}
            variant="ghost"
            colorScheme="red"
            onClick={handleLogout}
            _hover={{ bg: "red.600", color: "white" }}
          />

          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="outline"
            colorScheme="green"
          />
        </HStack>
      </Flex>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <Box pb={4} display={{ md: "none" }} bg="#1A202C" borderBottom="2px solid" borderColor="green.500">
          <Stack as="nav" spacing={2} px={4} pt={2}>
            {adminLinks.map((link) => (
              <Link
                key={link.label}
                as={RouterLink}
                to={link.to}
                p={3}
                display="flex"
                alignItems="center"
                borderRadius="md"
                _hover={{ bg: "green.600" }}
                onClick={onClose}
              >
                <Box mr={3}>{link.icon}</Box>
                {link.label}
              </Link>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
