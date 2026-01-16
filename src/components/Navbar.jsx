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
  Drawer,
  Heading,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Button,
  Image,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { useCart } from "../store/cart.context";
import { useAuth } from "../auth/AuthContext";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Productos", to: "/Productos" },
  { label: "Ofertas", hash: "offers" },
  { label: "Contáctanos", to: "/Contacto" },
];

export default function Navbar({ darkmode = false }) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // menú móvil
  const cartDrawer = useDisclosure(); // 👈 drawer del carrito
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { items, totals, removeItem, setQty, clear } = useCart();

  const { logout, isAuthed } = useAuth();

  useEffect(() => {
    const threshold = 18;
    const onScroll = () => setScrolled(window.scrollY > threshold);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const closeSession = () => {
    logout();
    navigate("/");
  }




  const goTo = (item) => {
    if (item.hash) {
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(item.hash);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      } else {
        const el = document.getElementById(item.hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    if (item.to) navigate(item.to);
  };

  const navBg = scrolled || darkmode ? "#636E52" : "rgba(255,255,255,0.18)";

  const accessButton = isAuthed ? (
    <Button onClick={closeSession} float='right'>Cerrar Sesión</Button>
  ) :
    <Button onClick={() => navigate("/inicio-sesion")}>Iniciar Sesión</Button>;

  return (
    <>
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
          <Heading
            as="h1"
            fontSize={{ base: "32px", md: "38px" }}
            fontWeight="800"
            lineHeight="1"
            letterSpacing="-0.02em"
            fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
            cursor="pointer"
            onClick={() => navigate("/")}
            userSelect="none"
          >
            <chakra.span color="#c5c5c5">Nutri</chakra.span>{" "}
            <chakra.span color="#373b32">Home</chakra.span>
          </Heading>

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

          {/* DERECHA: CARRITO + HAMBURGUESA */}
          <HStack spacing={2}>
            {/* CARRITO */}
            <Box position="relative">
              <IconButton
                aria-label="Abrir carrito"
                icon={<FiShoppingCart />}
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                _active={{ bg: "whiteAlpha.300" }}
                onClick={cartDrawer.onOpen}
              />

              {totals?.itemsCount > 0 && (
                <Box
                  position="absolute"
                  top="2px"
                  right="2px"
                  bg="red.500"
                  color="white"
                  fontSize="xs"
                  px="6px"
                  py="2px"
                  borderRadius="full"
                  lineHeight="1"
                  minW="18px"
                  textAlign="center"
                >
                  {totals.itemsCount}
                </Box>
              )}
            </Box>

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
          </HStack>
          <HStack w='auto'>
            {accessButton}
          </HStack>
        </Flex >

        {/* MENÚ MÓVIL */}
        {
          isOpen && (
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

                {/* ACCESO A CARRITO EN MÓVIL */}
                <Box as="li">
                  <Link
                    display="block"
                    py={2}
                    fontSize="sm"
                    fontWeight="700"
                    color="white"
                    _hover={{ bg: "whiteAlpha.200", textDecoration: "none" }}
                    borderRadius="md"
                    px={3}
                    cursor="pointer"
                    onClick={() => {
                      onClose();
                      navigate("/carrito");
                    }}
                  >
                    Ver carrito ({totals?.itemsCount || 0})
                  </Link>
                </Box>
                {isAuthed && isAuthed ? <Button onClick={closeSession}>Cerrar Sesión</Button> :
                  <Button onClick={() => navigate("/inicio-sesion")}>Iniciar Sesión</Button>}
              </Stack>
            </Box>
          )
        }
      </Box >

      {/* DRAWER MINI-CART */}
      < Drawer isOpen={cartDrawer.isOpen} placement="right" onClose={cartDrawer.onClose} size="sm" >
        <DrawerOverlay />
        <DrawerContent bg={'#4f5c3dc9'} backdropFilter={'blur(10px)'}>
          <DrawerHeader display="flex" alignItems="center" justifyContent="space-between">
            <Text color='white'>Tu carrito</Text>
            <Button color='white' variant="ghost" size="sm" onClick={() => {
              navigate("/carrito")
              cartDrawer.onClose()
            }
            }>
              Ver detalle
            </Button>
          </DrawerHeader>

          <DrawerBody>
            {items.length === 0 ? (
              <Text color="gray.200">Tu carrito está vacío.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((it) => {
                  const name = it.name ?? it.nombre ?? "Producto";
                  const price = Number(it.price ?? it.precio ?? 0);
                  const img = it.image ?? it.imageUrl ?? "https://via.placeholder.com/80";
                  console.log(it);

                  return (
                    <Flex key={it.id} gap={3} align="flex-start">
                      <Image src={img} w="70px" h="70px" borderRadius="md" objectFit="cover" alt={name} />
                      <Box flex="1">
                        <Text fontWeight="700" noOfLines={1} color='white'>{name}</Text>
                        <Text fontSize="sm" color="white">Q.{price.toFixed(2)}</Text>

                        <HStack mt={2}>
                          <Button
                            size="sm"
                            onClick={() => setQty(it.id, it.qty - 1)}
                            isDisabled={it.qty <= 1}
                          >
                            -
                          </Button>
                          <Box px={2} fontWeight="700" color='white'>{it.qty}</Box>
                          <Button size="sm" onClick={() => setQty(it.id, it.qty + 1)}>
                            +
                          </Button>
                        </HStack>
                      </Box>

                      <IconButton
                        aria-label="Eliminar"
                        icon={<FiTrash2 />}
                        color='white'
                        variant="ghost"
                        onClick={() => removeItem(it.id)}
                      />
                    </Flex>
                  );
                })}

                <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                  <HStack justify="space-between">
                    <Text fontWeight="700" color='white'>Subtotal</Text>
                    <Text fontWeight="800" color='white'>Q.{(totals?.subtotal || 0).toFixed(2)}</Text>
                  </HStack>

                  <HStack mt={3} spacing={3}>
                    <Button variant="outline" w="full" onClick={clear} color='white'>
                      Vaciar
                    </Button>
                    <Button
                      bg="#c7d5b491"
                      color="white"
                      _hover={{ bg: "#00000091" }}
                      w="full"
                      onClick={() => navigate("/carrito")}
                    >
                      Comprar
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer >
    </>
  );
}
