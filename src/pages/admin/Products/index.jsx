import React, { useState, useEffect } from "react";
import {
  Box, Button, Container, Heading, HStack, Input, Table, Tbody, Tr, Td, Th, Thead,
  IconButton, useToast, useDisclosure, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel,
  Select, NumberInput, NumberInputField, Switch, Image, Badge, Stack, Text,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { FiEdit2, FiPlus, FiTrash2, FiSearch } from "react-icons/fi";
import { api } from "../../../api/axios";

const INITIAL_FORM = {
  name: "", description: "", image_url: "", price: 0, stock: 0, id_category_fk: "", is_active: 1
};

export default function ProductMaintenance() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para el formulario (Edición o Creación)
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories")
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      toast({ title: "Error al cargar datos", status: "error" });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id_product);
    } else {
      setFormData(INITIAL_FORM);
      setEditingId(null);
    }
    onOpen();
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, formData);
        toast({ title: "Producto actualizado", status: "success" });
      } else {
        await api.post("/admin/products", formData);
        toast({ title: "Producto creado", status: "success" });
      }
      onClose();
      fetchData();
    } catch (err) {
      toast({ title: "Error al guardar", status: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desactivar este producto?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchData();
      toast({ title: "Producto desactivado", status: "info" });
    } catch (err) { toast({ title: "Error al eliminar", status: "error" }); }
  };

  const filteredProducts = React.useMemo(() => {
    return products
      .map((p) => {
        // Buscamos la categoría en el array de categorías
        const categoryObj = categories.find((c) => c.id_category === p.id_category_fk);
        return {
          ...p,
          // Usamos .name porque así viene de tu tabla 'categories'
          categoryName: categoryObj ? categoryObj.category : "Sin categoría"
        };
      })
      .filter((p) => {
        const search = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(search) ||
          p.categoryName.toLowerCase().includes(search)
        );
      });
  }, [products, categories, searchTerm]);


  console.log('filteredProducts', filteredProducts);

  return (
    <Container maxW="container.xl" py={8} mt="8vh">
      <Stack spacing={6}>
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Mantenimiento de Productos</Heading>
            <Text color="gray.500">Gestiona el inventario y precios</Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Nuevo Producto
          </Button>
        </HStack>

        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            bg="white"
          />
        </InputGroup>

        <Box bg="white" shadow="sm" borderRadius="lg" overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Imagen</Th>
                <Th>Producto</Th>
                <Th>Categoría</Th>
                <Th isNumeric>Precio</Th>
                <Th isNumeric>Stock</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map(p => (
                <Tr key={p.id_product}>
                  <Td><Image src={p.image_url} boxSize="40px" borderRadius="md" fallbackSrc="https://via.placeholder.com/40" /></Td>
                  <Td>
                    <Text fontWeight="bold">{p.name}</Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>{p.description}</Text>
                  </Td>
                  <Td><Badge colorScheme="purple">{p.categoryName}</Badge></Td>
                  <Td isNumeric>Q.{Number(p.price).toFixed(2)}</Td>
                  <Td isNumeric>
                    <Badge colorScheme={p.stock < 5 ? "red" : "green"}>{p.stock} un.</Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={p.is_active ? "green" : "gray"}>
                      {p.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton icon={<FiEdit2 />} size="sm" onClick={() => handleOpenModal(p)} aria-label="Editar" />
                      <IconButton icon={<FiTrash2 />} size="sm" colorScheme="red" variant="ghost"
                        onClick={() => handleDelete(p.id_product)} aria-label="Eliminar" />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      {/* MODAL FORMULARIO */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? "Editar Producto" : "Nuevo Producto"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Categoría</FormLabel>
                <Select placeholder="Selecciona categoría" value={formData.id_category_fk}
                  onChange={e => setFormData({ ...formData, id_category_fk: Number(e.target.value) })}>
                  {categories.map(c => <option key={c.id_category} value={c.id_category}>{c.name}</option>)}
                </Select>
              </FormControl>

              <HStack>
                <FormControl isRequired>
                  <FormLabel>Precio</FormLabel>
                  <NumberInput value={formData.price} min={0} onChange={val => setFormData({ ...formData, price: parseFloat(val) })}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Stock</FormLabel>
                  <NumberInput value={formData.stock} min={0} onChange={val => setFormData({ ...formData, stock: parseInt(val) })}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>URL Imagen</FormLabel>
                <Input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">¿Producto Activo?</FormLabel>
                <Switch isChecked={!!formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
            <Button colorScheme="blue" onClick={handleSubmit}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
