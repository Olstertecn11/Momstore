import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  SimpleGrid,
  Badge,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  SkeletonText,
  useToast,
  Tag,
  TagLabel,
  Progress,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaWhatsapp, FaMapMarkerAlt, FaClock, FaBoxOpen, FaReceipt } from "react-icons/fa";
import axios from "axios";
import environment from "../../config/environment"; // ajusta si tu path cambia
import { useParams } from "react-router-dom";

// ---- helpers: status mapping ----
const STATUS = {
  RECEIVED: { label: "Recibido", color: "blue", step: 10 },
  CONFIRMED: { label: "Confirmado", color: "purple", step: 35 },
  PREPARING: { label: "En preparación", color: "orange", step: 60 },
  OUT_FOR_DELIVERY: { label: "En ruta", color: "yellow", step: 80 },
  DELIVERED: { label: "Entregado", color: "green", step: 100 },
  CANCELLED: { label: "Cancelado", color: "red", step: 100 },
};

// Normaliza respuesta de tu API a un formato consistente
function normalizeOrder(raw) {
  if (!raw) return null;

  // intenta distintas formas comunes
  const code = raw.code || raw.order_code || raw.codigo || raw?.order?.code;
  const status = raw.status || raw.estado || raw?.order?.status || "RECEIVED";
  const entryDate = raw.entry_date || raw.entryDate || raw.created_at || raw?.order?.entry_date;

  const customer =
    raw.customer ||
    raw.anonimal_order_details ||
    raw.guest ||
    raw?.order?.customer || {
      name: raw.customer_name,
      email: raw.customer_email,
      phone: raw.customer_phone,
      address: raw.customer_address,
    };

  const items =
    raw.items ||
    raw.order_items ||
    raw.details ||
    raw.order_detail ||
    raw?.order?.items ||
    [];

  // items: intenta mapear para UI
  const normalizedItems = (Array.isArray(items) ? items : []).map((it) => ({
    id: it.id || it.id_order_detail || it.id_product_fk || it.product_id,
    name: it.name || it.product_name || it.product?.name || it.product?.nombre || "Producto",
    qty: Number(it.quantity ?? it.count ?? it.qty ?? 1),
    price: Number(it.price ?? it.unit_price ?? it.product?.price ?? 0),
    imageUrl: it.image_url || it.imageUrl || it.product?.image_url || "",
  }));

  return {
    code: String(code || ""),
    status: String(status),
    entryDate: entryDate ? String(entryDate) : "",
    customer: {
      name: customer?.name || customer?.customer_name || "",
      email: customer?.email || customer?.customer_email || "",
      phone: customer?.phone || customer?.customer_phone || "",
      address: customer?.address || customer?.customer_address || "",
    },
    items: normalizedItems,
    notes: raw.notes || raw.comentarios || raw?.order?.notes || "",
  };
}

function moneyQ(n) {
  const v = Number(n || 0);
  return `Q.${v.toFixed(2)}`;
}

export default function Order() {
  const toast = useToast();
  const params = useParams();
  const ORDER_CODE = params.code || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const statusMeta = useMemo(() => {
    const key = order?.status || "RECEIVED";
    return STATUS[key] || { label: key, color: "black", step: 15 };
  }, [order?.status]);

  const totals = useMemo(() => {
    const items = order?.items || [];
    const subtotal = items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 0), 0);
    const count = items.reduce((acc, it) => acc + (it.qty || 0), 0);
    return { subtotal, count };
  }, [order]);

  const whatsappLink = useMemo(() => {
    // cambia tu número real
    const WHATSAPP_NUMBER = "50200000000";
    if (!order?.code) return `https://wa.me/${WHATSAPP_NUMBER}`;

    const text = encodeURIComponent(
      `Hola MomStore 👋\nQuisiera información sobre mi pedido.\nCódigo: ${order.code}\nGracias.`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [order?.code]);

  const fetchOrderByCode = async (orderCode) => {
    // ✅ Ajusta si tu API usa otro endpoint
    // Ej: GET /api/orders/code/:code
    const url = `${environment.config.apiUrl}/orders/${encodeURIComponent(orderCode)}`;
    const { data } = await axios.get(url);
    return data;
  };

  const handleSearch = async () => {
    const c = code.trim();
    console.log("Buscando pedido con código:", c);
    if (c.length < 3) {
      toast({
        title: "Código inválido",
        description: "Escribe un código de pedido válido.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      setOrder(null);

      const raw = await fetchOrderByCode(c);
      const normalized = normalizeOrder(raw);

      if (!normalized?.code) {
        toast({
          title: "No encontrado",
          description: "No encontramos un pedido con ese código.",
          status: "info",
          duration: 2600,
          isClosable: true,
        });
        return;
      }

      setOrder(normalized);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo cargar el pedido.";

      toast({
        title: "Error",
        description: msg,
        status: "error",
        duration: 3200,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  React.useEffect(() => {
    if (ORDER_CODE) {
      setCode(ORDER_CODE);
      setTimeout(() => handleSearch(), 200);
    }
  }, []);

  return (
    <Box bg="gray.50" minH="100vh" pt={{ base: 20, md: 24 }} pb={{ base: 14, md: 18 }}>
      <Container maxW="6xl">
        {/* Header */}
        <Stack spacing={3} mb={8}>
          <HStack spacing={3} flexWrap="wrap">
            <Badge
              bg="white"
              border="1px solid"
              borderColor="blackAlpha.200"
              color="#1b2b1f"
              borderRadius="full"
              px={3}
              py={1}
              fontWeight="900"
            >
              Seguimiento de pedido
            </Badge>
            <Badge
              bg="green.50"
              border="1px solid"
              borderColor="green.200"
              color="green.700"
              borderRadius="full"
              px={3}
              py={1}
              fontWeight="900"
            >
              Actualización por estado
            </Badge>
          </HStack>

          <Heading fontSize={{ base: "28px", md: "44px" }} color="#1b2b1f" fontWeight="900">
            Consulta tu pedido con tu código
          </Heading>

          <Text color="gray.600" maxW="820px">
            Ingresa el código que te mostramos al finalizar la compra. Aquí verás el estado, productos y
            detalles de entrega.
          </Text>
        </Stack>

        {/* Search bar */}
        <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="green.200" mb={8} bg={"green.50"}>
          <CardBody>
            <Stack spacing={4}>
              <HStack spacing={3} flexWrap="wrap">
                <InputGroup maxW={{ base: "100%", md: "420px" }}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej: MS-9F3A2"
                    bg="white"
                    borderRadius="xl"
                    borderColor="blackAlpha.200"
                    _focusVisible={{
                      borderColor: "#88ad40",
                      boxShadow: "0 0 0 3px rgba(136,173,64,0.25)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                </InputGroup>

                <Button
                  onClick={handleSearch}
                  bg="#88ad40"
                  color="white"
                  borderRadius="full"
                  px={7}
                  _hover={{ bg: "#667e37" }}
                  isLoading={loading}
                  loadingText="Buscando..."
                >
                  Buscar pedido
                </Button>

                <Button
                  as="a"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  leftIcon={<Icon as={FaWhatsapp} />}
                  variant="outline"
                  borderRadius="full"
                  color="#25D366"
                  bg={'white'}
                  _hover={{ bg: "blackAlpha.50" }}
                >
                  Ayuda por WhatsApp
                </Button>
              </HStack>

              <Text fontSize="xs" color="gray.500">
                Tip: guarda tu código en WhatsApp o en notas para consultarlo cuando quieras.
              </Text>
            </Stack>
          </CardBody>
        </Card>

        {/* Loading skeleton */}
        {loading ? (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card borderRadius="2xl" boxShadow="sm">
              <CardBody>
                <Skeleton h="22px" w="220px" mb={4} />
                <SkeletonText noOfLines={6} spacing="3" />
              </CardBody>
            </Card>
            <Card borderRadius="2xl" boxShadow="sm">
              <CardBody>
                <Skeleton h="22px" w="180px" mb={4} />
                <SkeletonText noOfLines={8} spacing="3" />
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : null}

        {/* Order content */}
        {!loading && order ? (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* LEFT: Status + Customer */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100" bg='#D9E3D9'>
              <CardHeader pb={0}>
                <HStack justify="space-between" align="flex-start" flexWrap="wrap" gap={3}>
                  <Box>
                    <HStack spacing={2}>
                      <Icon as={FaReceipt} color="#636E52" />
                      <Heading size="md" color='black'>
                        Pedido {order.code}
                      </Heading>
                    </HStack>
                    <Text color="gray.500" fontSize="sm" mt={1}>
                      {order.entryDate ? `Fecha: ${order.entryDate}` : "Fecha: —"}
                    </Text>
                  </Box>

                  <Tag size="lg" borderRadius="full" colorScheme={statusMeta.color}>
                    <TagLabel fontWeight="900" color={'black'}>{statusMeta.label}</TagLabel>
                  </Tag>
                </HStack>
              </CardHeader>

              <CardBody>
                <Stack spacing={5}>
                  <Box>
                    <Text fontWeight="900" color="black" mb={2}>
                      Progreso
                    </Text>
                    <Progress value={statusMeta.step} borderRadius="full" />
                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="xs" color="black">
                        Recibido
                      </Text>
                      <Text fontSize="xs" color="black">
                        Entregado
                      </Text>
                    </HStack>
                  </Box>

                  <Divider />

                  <Box>
                    <HStack spacing={2} mb={2}>
                      <Icon as={FaBoxOpen} color="black" />
                      <Text fontWeight="900" color="black">
                        Datos del cliente
                      </Text>
                    </HStack>

                    <Stack spacing={2}>
                      <InfoRow label="Nombre" value={order.customer.name || "—"} />
                      <InfoRow label="Teléfono" value={order.customer.phone || "—"} />
                      <InfoRow label="Email" value={order.customer.email || "—"} />
                      <HStack align="flex-start" spacing={3}>
                        <Icon as={FaMapMarkerAlt} color="gray.400" mt="2px" />
                        <Box>
                          <Text fontSize="xs" color="black">
                            Dirección
                          </Text>
                          <Text fontWeight="700" color="black">
                            {order.customer.address || "—"}
                          </Text>
                        </Box>
                      </HStack>
                    </Stack>
                  </Box>

                  {order.notes ? (
                    <>
                      <Divider />
                      <Box>
                        <HStack spacing={2}>
                          <Icon as={FaClock} color="#636E52" />
                          <Text fontWeight="900" color="#1b2b1f">
                            Nota
                          </Text>
                        </HStack>
                        <Text color="gray.600" fontSize="sm" mt={2}>
                          {order.notes}
                        </Text>
                      </Box>
                    </>
                  ) : null}

                  <Button
                    as="a"
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    leftIcon={<Icon as={FaWhatsapp} />}
                    bg="white"
                    color="black"
                    borderRadius="full"
                    _hover={{ filter: "brightness(0.95)" }}
                  >
                    Preguntar por WhatsApp
                  </Button>
                </Stack>
              </CardBody>
            </Card>

            {/* RIGHT: Items */}
            <Card borderRadius="2xl" boxShadow="sm" border="1px solid" bg="#636E52">
              <CardHeader pb={0}>
                <Heading size="md" color="gray.100">
                  Productos en tu pedido
                </Heading>
                <Text color="gray.300" fontSize="sm" mt={1}>
                  {totals.count} artículo(s) • Subtotal estimado {moneyQ(totals.subtotal)}
                </Text>
              </CardHeader>

              <CardBody>
                <Stack spacing={4}>
                  {order.items.length ? (
                    order.items.map((it, idx) => (
                      <Box key={`${it.id}-${idx}`}>
                        <HStack justify="space-between" align="flex-start" spacing={4}>
                          <Box>
                            <Text fontWeight="900" color="gray.100" noOfLines={2}>
                              {it.name}
                            </Text>
                            <Text fontSize="sm" color="gray.300" mt={1}>
                              Cantidad: <b>{it.qty}</b>
                            </Text>
                          </Box>

                          <Box textAlign="right">
                            <Text fontWeight="900" color="gray.100">
                              {moneyQ((it.price || 0) * (it.qty || 0))}
                            </Text>
                            <Text fontSize="xs" color="gray.100">
                              {it.price ? `${moneyQ(it.price)} c/u` : "—"}
                            </Text>
                          </Box>
                        </HStack>

                        {idx !== order.items.length - 1 ? <Divider my={4} /> : null}
                      </Box>
                    ))
                  ) : (
                    <Text color="gray.100">No hay productos para mostrar.</Text>
                  )}

                  <Divider />

                  <HStack justify="space-between">
                    <Text fontWeight="900" color="gray.100">
                      Total estimado
                    </Text>
                    <Text fontWeight="900" color="gray.100">
                      {moneyQ(totals.subtotal)}
                    </Text>
                  </HStack>

                  <Text fontSize="xs" color="gray.300">
                    *El total final puede variar según disponibilidad y lote. El equipo confirma antes de entregar.
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : null}

        {!loading && !order ? (
          <Box
            mt={10}
            borderRadius="2xl"
            bg="white"
            border="1px solid"
            borderColor="blackAlpha.100"
            p={{ base: 6, md: 8 }}
            boxShadow="sm"
          >
            <Heading size="md" color="#1b2b1f">
              ¿Aún no tienes tu código?
            </Heading>
            <Text color="gray.600" mt={2} maxW="820px">
              Finaliza tu compra en el carrito y te mostraremos un código de pedido. También puedes solicitarlo
              por WhatsApp si ya hiciste tu pedido.
            </Text>
            <HStack mt={5} spacing={3} flexWrap="wrap">
              <Button as="a" href={whatsappLink} target="_blank" rel="noreferrer" leftIcon={<Icon as={FaWhatsapp} />}
                bg="#25D366" color="white" borderRadius="full" _hover={{ filter: "brightness(0.95)" }}>
                Pedir mi código por WhatsApp
              </Button>
            </HStack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}

function InfoRow({ label, value }) {
  return (
    <HStack justify="space-between">
      <Text fontSize="xs" color="black">
        {label}
      </Text>
      <Text fontWeight="800" color="black">
        {value}
      </Text>
    </HStack>
  );
}
