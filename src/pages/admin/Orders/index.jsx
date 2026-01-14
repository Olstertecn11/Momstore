import React from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Tag,
  TagLabel,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Badge,
  Skeleton,
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon } from "@chakra-ui/icons";
import { api } from "../../../api/axios";

const FLOW = ["RECEIVED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

function nextStatus(current) {
  if (!current) return "RECEIVED";
  if (current === "CANCELLED" || current === "DELIVERED") return null;
  const i = FLOW.indexOf(current);
  if (i === -1) return null;
  return FLOW[i + 1] || null;
}

function statusColorScheme(status) {
  switch (status) {
    case "RECEIVED": return "gray";
    case "CONFIRMED": return "blue";
    case "PREPARING": return "purple";
    case "OUT_FOR_DELIVERY": return "orange";
    case "DELIVERED": return "green";
    case "CANCELLED": return "red";
    default: return "gray";
  }
}

function formatDate(value) {
  if (!value) return "-";
  // Si viene como "YYYY-MM-DD ..." lo mostramos simple
  return String(value).slice(0, 16).replace("T", " ");
}

export default function Orders() {
  const toast = useToast();

  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const [updatingId, setUpdatingId] = React.useState(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast({
        title: "No se pudieron cargar las órdenes",
        description: err?.response?.data?.message || "Error de servidor",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((o) => {
        if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
        if (!q) return true;
        // busca por code o id
        const code = String(o.code || "").toLowerCase();
        const id = String(o.id_order || "");
        return code.includes(q) || id.includes(q);
      });
  }, [rows, search, statusFilter]);

  async function updateStatus(id_order, newStatus) {
    setUpdatingId(id_order);
    try {
      await api.patch(`/admin/orders/${id_order}/status`, { status: newStatus });
      setRows((prev) =>
        prev.map((o) => (o.id_order === id_order ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o))
      );
      toast({
        title: "Estado actualizado",
        description: `Orden #${id_order} → ${newStatus}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "No se pudo actualizar",
        description: err?.response?.data?.message || "Error de servidor",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Container maxW="6xl" py="8">
      <Stack spacing="5">
        <HStack justify="space-between" align="start" flexWrap="wrap" gap="3">
          <Box>
            <Heading size="lg">Órdenes</Heading>
            <Text opacity={0.75} fontSize="sm">
              Gestión de pedidos (cambio de estado y seguimiento)
            </Text>
          </Box>

          <HStack gap="2">
            <Button
              leftIcon={<RepeatIcon />}
              onClick={loadOrders}
              isLoading={loading}
              variant="outline"
            >
              Refrescar
            </Button>
          </HStack>
        </HStack>

        <Card borderRadius="2xl">
          <CardBody>
            <HStack gap="3" flexWrap="wrap">
              <InputGroup maxW={{ base: "100%", md: "360px" }}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon opacity={0.6} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar por código o ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Select
                maxW={{ base: "100%", md: "260px" }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos los estados</option>
                <option value="RECEIVED">RECEIVED</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Select>

              <Tag borderRadius="full" variant="subtle">
                <TagLabel>{filtered.length} resultado(s)</TagLabel>
              </Tag>
            </HStack>
          </CardBody>
        </Card>

        <Divider />

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
            <Skeleton height="140px" borderRadius="2xl" />
            <Skeleton height="140px" borderRadius="2xl" />
            <Skeleton height="140px" borderRadius="2xl" />
            <Skeleton height="140px" borderRadius="2xl" />
          </SimpleGrid>
        ) : filtered.length === 0 ? (
          <Box p="10" textAlign="center" borderWidth="1px" borderRadius="2xl">
            <Heading size="md">Sin resultados</Heading>
            <Text opacity={0.7} mt="2">
              Ajusta filtros o busca por código/ID.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
            {filtered.map((o) => {
              const next = nextStatus(o.status);
              const canCancel = o.status !== "CANCELLED" && o.status !== "DELIVERED";

              return (
                <Card key={o.id_order} borderRadius="2xl">
                  <CardBody>
                    <Stack spacing="3">
                      <HStack justify="space-between" align="start">
                        <Box>
                          <HStack spacing="2" align="center" flexWrap="wrap">
                            <Heading size="md">Orden #{o.id_order}</Heading>
                            {o.code ? (
                              <Badge variant="subtle" borderRadius="md">
                                {o.code}
                              </Badge>
                            ) : null}
                          </HStack>
                          <Text fontSize="sm" opacity={0.75}>
                            Creada: {formatDate(o.created_at || o.entry_date)}
                          </Text>
                          <Text fontSize="sm" opacity={0.75}>
                            Actualizada: {formatDate(o.updated_at)}
                          </Text>
                        </Box>

                        <Tag colorScheme={statusColorScheme(o.status)} borderRadius="full">
                          <TagLabel>{o.status}</TagLabel>
                        </Tag>
                      </HStack>

                      <Divider />

                      <HStack justify="space-between" flexWrap="wrap" gap="2">
                        <Box>
                          <Text fontSize="sm" opacity={0.8}>
                            Entrega esperada:{" "}
                            <b>{o.expected_delivery_date ? String(o.expected_delivery_date) : "-"}</b>
                          </Text>
                        </Box>

                        <HStack>
                          <Button
                            size="sm"
                            variant="outline"
                            isDisabled={!next || updatingId === o.id_order}
                            isLoading={updatingId === o.id_order && !!next}
                            onClick={() => next && updateStatus(o.id_order, next)}
                          >
                            Avanzar {next ? `→ ${next}` : ""}
                          </Button>

                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="solid"
                            isDisabled={!canCancel || updatingId === o.id_order}
                            isLoading={updatingId === o.id_order && canCancel}
                            onClick={() => canCancel && updateStatus(o.id_order, "CANCELLED")}
                          >
                            Cancelar
                          </Button>
                        </HStack>
                      </HStack>

                      <Text fontSize="xs" opacity={0.6}>
                        Nota: “Avanzar” solo permite el siguiente estado del flujo. “Cancelar” está permitido en cualquier punto.
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
