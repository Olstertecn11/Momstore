import React, { useState, useEffect, useMemo } from "react";
import {
  Box, Button, Container, Heading, HStack, Input, InputGroup, InputLeftElement,
  Select, Stack, Tag, TagLabel, Text, useToast, SimpleGrid, Card, CardBody,
  Divider, Badge, Skeleton, IconButton, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Table, Tbody,
  Tr, Td, Th, Thead, Image, Icon, Flex, VStack
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon } from "@chakra-ui/icons";
import { FiEye, FiPackage, FiTruck, FiUser, FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { api } from "../../../api/axios";

// Coincide exactamente con tu ENUM de base de datos
const FLOW = ["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "DELIVERED"];

function nextStatus(current) {
  if (current === "CANCELLED" || current === "DELIVERED") return null;
  const i = FLOW.indexOf(current);
  if (i === -1) return null;
  return FLOW[i + 1] || null;
}

function statusColorScheme(status) {
  const colors = {
    PENDING: "gray",
    CONFIRMED: "blue",
    PREPARING: "purple",
    READY: "cyan",
    OUT_FOR_DELIVERY: "orange",
    DELIVERED: "green",
    CANCELLED: "red"
  };
  return colors[status] || "gray";
}

export default function Orders() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({ title: "Error al cargar órdenes", status: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrders(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((o) => {
      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch = !q || o.code.toLowerCase().includes(q) || String(o.id_order).includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  async function handleOpenDetail(order) {
    setSelectedOrder(order);
    onOpen();
    setLoadingItems(true);
    try {
      const res = await api.get(`/admin/orders/${order.id_order}/items`);
      setOrderItems(res.data);
    } catch (err) {
      toast({ title: "Error al cargar productos", status: "error" });
    } finally {
      setLoadingItems(false);
    }
  }

  async function updateStatus(id_order, newStatus) {
    setUpdatingId(id_order);
    try {
      await api.patch(`/admin/orders/${id_order}/status`, { status: newStatus });
      setRows(prev => prev.map(o => o.id_order === id_order ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id_order === id_order) setSelectedOrder({ ...selectedOrder, status: newStatus });
      toast({ title: "Estado actualizado", status: "success", duration: 1500 });
    } catch (err) {
      toast({ title: "Error al actualizar", status: "error" });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Container maxW="6xl" py="8" mt={'8vh'}>
      <Stack spacing="5">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Gestión de Pedidos</Heading>
            <Text color="gray.500">Administra el flujo de despacho</Text>
          </Box>
          <Button leftIcon={<RepeatIcon />} onClick={loadOrders} isLoading={loading}>Refrescar</Button>
        </HStack>

        {/* FILTROS */}
        <HStack gap="3">
          <InputGroup>
            <InputLeftElement><SearchIcon color="gray.400" /></InputLeftElement>
            <Input placeholder="Código o ID de orden..." value={search} onChange={e => setSearch(e.target.value)} bg="white" />
          </InputGroup>
          <Select maxW="250px" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} bg="white">
            <option value="ALL">Todos los estados</option>
            {FLOW.concat("CANCELLED").map(s => <option key={s} value={s}>{s}</option>)}
          </Select>
        </HStack>

        {/* LISTADO */}
        {loading ? <Skeleton height="200px" borderRadius="2xl" /> : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
            {filtered.map((o) => {
              const next = nextStatus(o.status);
              return (
                <Card key={o.id_order} borderRadius="xl" shadow="sm">
                  <CardBody>
                    <Flex justify="space-between" mb={3}>
                      <VStack align="start" spacing={0}>
                        <Heading size="sm">Orden: {o.code}</Heading>
                        <Text fontSize="xs" color="gray.500">ID DB: #{o.id_order}</Text>
                      </VStack>
                      <Tag colorScheme={statusColorScheme(o.status)}>{o.status}</Tag>
                    </Flex>

                    <Text fontSize="sm" mb={4}>
                      <b>Cliente:</b> {o.customer_name || o.registered_username || "Usuario"}
                    </Text>

                    <HStack justify="space-between">
                      <Button leftIcon={<FiEye />} size="sm" onClick={() => handleOpenDetail(o)}>Ver Detalle</Button>
                      {next && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          isLoading={updatingId === o.id_order}
                          onClick={() => updateStatus(o.id_order, next)}
                        >
                          Mover a {next}
                        </Button>
                      )}
                    </HStack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>

      {/* MODAL DETALLE */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader borderBottomWidth="1px">Detalles del Pedido {selectedOrder?.code}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8}>
            <Stack spacing={6}>
              {/* DATOS DE CONTACTO */}
              <Box bg="blue.50" p={4} borderRadius="lg">
                <Heading size="xs" mb={3} color="blue.700">DATOS DE ENVÍO</Heading>
                <VStack align="start" spacing={2} fontSize="sm">
                  <HStack><Icon as={FiUser} /><Text><b>Nombre:</b> {selectedOrder?.customer_name || selectedOrder?.registered_username}</Text></HStack>
                  <HStack><Icon as={FiPhone} /><Text><b>Tel:</b> {selectedOrder?.customer_phone || "N/A"}</Text></HStack>
                  <HStack><Icon as={FiMail} /><Text><b>Email:</b> {selectedOrder?.customer_email || "N/A"}</Text></HStack>
                  <HStack align="start"><Icon as={FiMapPin} mt={1} /><Text><b>Dirección:</b> {selectedOrder?.customer_address || "Sin dirección"}</Text></HStack>
                </VStack>
              </Box>

              {/* TABLA PRODUCTOS */}
              <Box>
                <Heading size="xs" mb={3} display="flex" alignItems="center"><Icon as={FiPackage} mr={2} />ITEMS DEL PEDIDO</Heading>
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Producto</Th>
                      <Th isNumeric>Cant.</Th>
                      <Th isNumeric>P. Unitario</Th>
                      <Th isNumeric>Subtotal</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orderItems.map(item => (
                      <Tr key={item.id_order_detail}>
                        <Td>
                          <HStack>
                            <Image src={item.image_url} boxSize="35px" borderRadius="md" fallbackSrc="https://via.placeholder.com/35" />
                            <Text fontWeight="600">{item.product_name}</Text>
                          </HStack>
                        </Td>
                        <Td isNumeric>{item.quantity}</Td>
                        <Td isNumeric>Q.{Number(item.unit_price).toFixed(2)}</Td>
                        <Td isNumeric>Q.{Number(item.line_amount).toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
