import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  HStack,
  VStack,
  Image,
  Button,
  IconButton,
  Divider,
  Input,
  Badge,
} from "@chakra-ui/react";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../store/cart.context";
import axios from "axios";
import environment from '../../config/environment'
import { useToast } from "@chakra-ui/react";

export default function Cart() {
  const navigate = useNavigate();
  const { items, totals, removeItem, setQty, clear } = useCart();

  const subtotal = Number(totals?.subtotal || 0);
  const itemsCount = Number(totals?.itemsCount || 0);
  const toast = useToast();
  const [sending, setSending] = React.useState(false);


  const sendOrder = async () => {
    if (!items?.length) return;

    // 1) Normaliza items del carrito a lo que espera tu API
    //    Ajusta aquí según cómo venga tu item (id_product vs id)
    const orderItems = items.map((it) => {
      const productId = it.id_product ?? it.id; // 👈 clave
      const qty = Number(it.qty || 0);

      return {
        product_id: Number(productId),
        quantity: qty,
      };
    }).filter(i => Number.isFinite(i.product_id) && i.product_id > 0 && i.quantity > 0);

    if (!orderItems.length) {
      toast({
        title: "Carrito inválido",
        description: "No se encontraron productos válidos para enviar.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // 2) Customer (ideal: lo pides en un form/modal)
    //    Por ahora: placeholders seguros
    const customer = {
      name: "Cliente",          // TODO: pedirlo al usuario
      email: "olivertzunun.mingob@gmail.com",                // opcional
      phone: "59621085",        // TODO
      address: "11 av 17-25 zona 2",              // opcional
    };

    // 3) Payload final
    const orderPayload = {
      customer,
      items: orderItems,
    };

    try {
      setSending(true);

      const url = `${environment.config.apiUrl}/orders`;
      const { data } = await axios.post(url, orderPayload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      // Esperamos algo como: { code: "ABC123", id_order: 10 } o similar
      const code = data?.code || data?.order?.code;
      const orderId = data?.id_order || data?.order?.id_order || data?.orderId;

      toast({
        title: "Pedido creado",
        description: code ? `Código: ${code}` : "Tu pedido fue registrado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      clear();

      // Si tienes una página de estado del pedido:
      // Ej: /pedido/:code o /orders/:id
      if (code) {
        navigate(`/pedido/${code}`);
      } else if (orderId) {
        navigate(`/orders/${orderId}`);
      } else {
        // fallback: vuelve a productos
        navigate("/Productos");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo procesar el pedido.";

      toast({
        title: "Error al enviar pedido",
        description: msg,
        status: "error",
        duration: 3500,
        isClosable: true,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box bg="#F3F7FB" minH="100vh" pt={{ base: 24, md: 28 }} pb={14}>
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* Header */}
        <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
          <Box>
            <HStack spacing={3} align="center">
              <IconButton
                aria-label="Volver"
                icon={<FiArrowLeft />}
                variant="ghost"
                onClick={() => navigate(-1)}
              />
              <Heading color="#0F172A" fontSize={{ base: "2xl", md: "3xl" }}>
                Carrito de compras
              </Heading>
            </HStack>
            <Text color="gray.600" mt={1}>
              Revisa tus productos, ajusta cantidades y finaliza tu compra.
            </Text>
          </Box>

          <HStack spacing={3}>
            <Badge bg='green.800' fontSize="sm" px={3} py={1} borderRadius="full">
              {itemsCount} artículo(s)
            </Badge>
          </HStack>
        </Flex>

        <Flex mt={8} gap={8} direction={{ base: "column", lg: "row" }} align="flex-start">
          {/* Lista productos */}
          <Box flex="1" bg="white" borderRadius="2xl" boxShadow="0 20px 50px rgba(15,23,42,0.08)" p={{ base: 4, md: 6 }}>
            {items.length === 0 ? (
              <VStack py={10} spacing={4}>
                <Heading fontSize="xl" color="#0F172A">
                  Tu carrito está vacío
                </Heading>
                <Text color="gray.600" textAlign="center" maxW="420px">
                  Explora nuestros productos y agrega tus favoritos para continuar.
                </Text>
                <Button bg="green.700" color="white" _hover={{ bg: "#008fca" }} onClick={() => navigate("/Productos")}>
                  Ir a productos
                </Button>
              </VStack>
            ) : (
              <VStack align="stretch" spacing={5}>
                {items.map((it, idx) => {
                  const name = it.name ?? it.nombre ?? "Producto";
                  const price = Number(it.price ?? it.precio ?? 0);
                  const img = it.image ?? it.imageUrl ?? "https://via.placeholder.com/120";
                  const lineTotal = price * it.qty;

                  return (
                    <Box key={it.id}>
                      <Flex gap={4} align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }}>
                        <Image
                          src={img}
                          alt={name}
                          w={{ base: "100%", md: "110px" }}
                          h={{ base: "220px", md: "110px" }}
                          borderRadius="xl"
                          objectFit="cover"
                        />

                        <Box flex="1">
                          <Text fontWeight="800" color="#0F172A" fontSize="lg" noOfLines={1}>
                            {name}
                          </Text>
                          <Text color="gray.600" fontSize="sm" mt={1}>
                            Precio: <b>Q.{price.toFixed(2)}</b>
                          </Text>

                          {/* Cantidad */}
                          <HStack mt={4} spacing={3} flexWrap="wrap">
                            <HStack>
                              <Button
                                size="sm"
                                bg='green.900'
                                _hover={{ bg: "green.800" }}
                                onClick={() => setQty(it.id, it.qty - 1)}
                                isDisabled={it.qty <= 1}
                              >
                                -
                              </Button>

                              <Input
                                value={it.qty}
                                readOnly
                                w="60px"
                                color={"green.800"}
                                textAlign="center"
                                fontWeight="700"
                              />

                              <Button size="sm" onClick={() => setQty(it.id, it.qty + 1)} bg='green.900'
                                _hover={{ bg: "green.800" }}>
                                +
                              </Button>
                            </HStack>

                            <Box>
                              <Text fontWeight="800" color="#0F172A">
                                Total: Q.{lineTotal.toFixed(2)}
                              </Text>
                            </Box>

                            <IconButton
                              aria-label="Eliminar"
                              icon={<FiTrash2 />}
                              variant="ghost"
                              onClick={() => removeItem(it.id)}
                            />
                          </HStack>
                        </Box>
                      </Flex>

                      {idx !== items.length - 1 && <Divider mt={5} />}
                    </Box>
                  );
                })}

                <Button variant="outline" onClick={clear} border="1px solid #2A3232" color="#2A3232">
                  Vaciar carrito
                </Button>
              </VStack>

            )}
          </Box>

          {/* Resumen */}
          <Box
            w={{ base: "100%", lg: "380px" }}
            position={{ base: "static", lg: "sticky" }}
            top="100px"
            bg="white"
            borderRadius="2xl"
            boxShadow="0 20px 50px rgba(15,23,42,0.08)"
            p={{ base: 4, md: 6 }}
          >
            <Heading fontSize="xl" color="#0F172A">
              Resumen del pedido
            </Heading>

            <Text color="gray.600" mt={2} fontSize="sm">
              Antes de pagar, revisa tu subtotal. El envío e impuestos se calculan en checkout.
            </Text>

            <Divider my={5} />

            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text color="gray.600">Artículos</Text>
                <Text fontWeight="700">{itemsCount}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text color="gray.600">Subtotal</Text>
                <Text fontWeight="800">Q.{subtotal.toFixed(2)}</Text>
              </HStack>

              <HStack justify="space-between">
                <Text color="gray.600">Envío</Text>
                <Text fontWeight="700">Se calcula</Text>
              </HStack>

              <Divider />

              <HStack justify="space-between">
                <Text fontWeight="800" color="#0F172A">Total estimado</Text>
                <Text fontWeight="900" color="#0F172A">Q.{subtotal.toFixed(2)}</Text>
              </HStack>
            </VStack>

            <Button
              mt={6}
              w="full"
              bg='green.800'
              color="white"
              _hover={{ bg: "green.900" }}
              py={6}
              borderRadius="xl"
              onClick={sendOrder}
              isDisabled={items.length === 0}
            >
              Finalizar compra
            </Button>

            <Button
              mt={3}
              w="full"
              variant="outline"
              borderRadius="xl"
              onClick={() => navigate("/Productos")}
            >
              Seguir comprando
            </Button>

            <Box mt={6} bg="#F3F7FB" borderRadius="xl" p={4}>
              <Text fontWeight="800" color="#0F172A">
                Tip MomStore ✨
              </Text>
              <Text color="gray.600" fontSize="sm" mt={1}>
                Si compras más de un producto, puedes ajustar cantidades para ahorrar tiempo en checkout.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
