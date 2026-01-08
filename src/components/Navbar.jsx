import React, { useEffect, useState } from "react";
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
import { Link as RouterLink, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/Productos" },
  { label: "Ofertas", hash: "offers" },      // 👈 scroll interno
  { label: "Contáctanos", to: "/Contacto" },
];

export default function Navbar({ darkmode = false }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const threshold = 18;
    const onScroll = () => setScrolled(window.scrollY > threshold);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (item) => {
    // Si es scroll a sección en la misma página (Home)
    if (item.hash) {
      // si no estás en home, primero navega y luego scrollea
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(item.hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } else {
        const el = document.getElementById(item.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    // ruta normal
    if (item.to) navigate(item.to);
  };

  const navBg = scrolled || darkmode ? "#636E52" : "rgba(255,255,255,0.18)";

  return (
    <Box
      as="nav"
      position="fixed"
      top="0"
      left="0"
      w="100%"
      h={{ base: "64px", md: "70px" }}
      zIndex="100"
      bg={navBg}
      transition="background 0.25s ease, box-shadow 0.25s ease"
      boxShadow={scrolled ? "md" : "sm"}
      borderBottom="1px solid"
      borderColor="rgba(255,255,255,0.10)"
      sx={
        scrolled
          ? {}
          : { backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }
      }
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
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="800"
          color="white"
          letterSpacing="0.02em"
          cursor="pointer"
          onClick={() => navigate("/")}
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
              {item.to ? (
                <Link
                  as={RouterLink}
                  to={item.to}
                  fontSize="sm"
                  fontWeight="600"
                  color="white"
                  _hover={{ opacity: 0.9, textDecoration: "none" }}
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  onClick={() => goTo(item)}
                  fontSize="sm"
                  fontWeight="600"
                  color="white"
                  _hover={{ opacity: 0.9, textDecoration: "none" }}
                  px={2}
                  py={1}
                  borderRadius="full"
                  cursor="pointer"
                >
                  {item.label}
                </Link>
              )}
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
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
          _active={{ bg: "whiteAlpha.300" }}
        />
      </Flex>

      {/* MENÚ MÓVIL */}
      {isOpen && (
        <Box
          bg="#636E52"
          borderTop="1px solid rgba(255,255,255,0.12)"
          boxShadow="md"
          display={{ base: "block", md: "none" }}
        >
          <Stack as="ul" listStyleType="none" spacing={1} py={3} px={4}>
            {navLinks.map((item) => (
              <Box as="li" key={item.label}>
                {item.to ? (
                  <Link
                    as={RouterLink}
                    to={item.to}
                    display="block"
                    py={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
                    borderRadius="md"
                    px={3}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    display="block"
                    py={2}
                    fontSize="sm"
                    fontWeight="600"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
                    borderRadius="md"
                    px={3}
                    cursor="pointer"
                    onClick={() => {
                      onClose();
                      goTo(item);
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
