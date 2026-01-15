import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  HStack,
  SimpleGrid,
  Button,
  Icon,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Badge,
  Divider,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import { PhoneIcon, EmailIcon } from "@chakra-ui/icons";
import { FaWhatsapp, FaMapMarkerAlt, FaClock, FaShoppingBasket } from "react-icons/fa";
import bgImage from '../assets/images/contact_background.jpg';
import WaveText from "../components/common/WaveText";

export default function Contact() {
  const toast = useToast();

  // ✅ Edita estos datos a los tuyos
  const WHATSAPP_NUMBER = "50246204465"; // solo números (ej: 50259621085)
  const DISPLAY_PHONE = "+502 4620-4465";
  const EMAIL = "ventas@nutrihome.com";
  const LOCATION = "Guatemala";
  const HOURS = "Lun–Vie: 8:00am–6:00pm";

  const whatsappLink = useMemo(() => {
    const text = encodeURIComponent(
      "Hola NutriHome 👋\nQuisiera hacer un pedido / consultar disponibilidad. ¿Me pueden ayudar?"
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [WHATSAPP_NUMBER]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast({
        title: "Faltan datos",
        description: "Por favor llena tu nombre, teléfono y mensaje.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "¡Recibido!",
      description: "Gracias. Te contactaremos en breve para confirmar tu pedido.",
      status: "success",
      duration: 2800,
      isClosable: true,
    });

    setForm({ name: "", email: "", phone: "", address: "", message: "" });
  };

  return (
    <Box bg="gray.50">
      {/* HERO */}
      <Box position="relative" overflow="hidden" pt={{ base: 18, md: 24 }} pb={{ base: 10, md: 12 }}>
        {/* Glow background */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(at top left, #88ad40 0px, transparent 58%), radial(at bottom right, #636E52 0px, transparent 55%)"
          opacity={0.35}
        />
        <Container position="relative" zIndex={1} maxW="6xl" p={6}>
          <Box backgroundImage={bgImage} position='absolute' top={0} left={0} width='100%' height='100%' bgSize='cover' bgPosition='center' filter='brightness(0.6)' borderRadius='xl' zIndex={-1}>
          </Box>
          <Stack spacing={6}>
            <HStack spacing={3} flexWrap="wrap">
              <Badge
                bg="white"
                color="#1b2b1f"
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="full"
                px={3}
                py={1}
                fontWeight="800"
              >
                Atención rápida
              </Badge>
              <Badge
                bg="green.50"
                color="green.700"
                border="1px solid"
                borderColor="green.200"
                borderRadius="full"
                px={3}
                py={1}
                fontWeight="800"
              >
                Pedidos por WhatsApp
              </Badge>
            </HStack>

            <Heading
              fontSize={{ base: "34px", md: "52px" }}
              lineHeight="1.05"
              color="white"
              // color="#1b2b1f"
              fontWeight="900"
              letterSpacing="-0.6px"
            >
              Contáctanos y arma tu pedido
              <br />
              en minutos.
            </Heading>

            <Text color="white" maxW="760px" fontSize={{ base: "sm", md: "md" }}>
              ¿Buscas semillas, mantequilla de maní, snacks, aceites o productos tipo PriceSmart?
              Escríbenos y te confirmamos disponibilidad, total y fecha de entrega.
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <Button
                as="a"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                leftIcon={<Icon as={FaWhatsapp} />}
                bg="#25D366"
                color="white"
                borderRadius="full"
                px={7}
                _hover={{ filter: "brightness(0.95)" }}
              >
                Escribir por WhatsApp
              </Button>

              <Button
                as="a"
                href={`tel:${DISPLAY_PHONE.replace(/\s/g, "")}`}
                leftIcon={<PhoneIcon />}
                variant="outline"
                borderRadius="full"
                px={7}
                borderColor="whiteAlpha.400"
                color="whiteAlpha.900"
                // color="#1b2b1f"
                _hover={{ bg: "blackAlpha.50" }}
              >
                Llamar
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="6xl" pb={{ base: 14, md: 18 }}>
        {/* CONTACT CARDS - NEW STYLE */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
          <ContactCard
            icon={FaWhatsapp}
            title="WhatsApp"
            subtitle="Respuesta rápida"
            value={DISPLAY_PHONE}
            accent="#25D366"
            buttonLabel="Abrir chat"
            variant="solid"
            onClick={() => window.open(whatsappLink, "_blank", "noreferrer")}
          />
          <ContactCard
            icon={PhoneIcon}
            title="Teléfono"
            subtitle="Llamadas y pedidos"
            value={DISPLAY_PHONE}
            accent="#636E52"
            buttonLabel="Llamar"
            variant="outline"
            onClick={() => (window.location.href = `tel:${DISPLAY_PHONE.replace(/\s/g, "")}`)}
          />
          <ContactCard
            icon={EmailIcon}
            title="Correo"
            subtitle="Cotizaciones"
            value={EMAIL}
            accent="#88ad40"
            buttonLabel="Enviar correo"
            variant="outline"
            onClick={() => (window.location.href = `mailto:${EMAIL}`)}
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* FORM */}
          <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
            <CardHeader pb={0}>
              <Heading size="md" color="#1b2b1f">
                Envíanos tu pedido o consulta
              </Heading>
              <Text color="gray.600" fontSize="sm" mt={1}>
                Completa el formulario y te confirmamos disponibilidad y entrega.
              </Text>
            </CardHeader>

            <CardBody>
              <Box as="form" onSubmit={onSubmit}>
                <Stack spacing={4}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        value={form.name}
                        onChange={onChange("name")}
                        placeholder="Tu nombre"
                        bg="white"
                        borderRadius="xl"
                        borderColor="blackAlpha.200"
                        _focusVisible={{ borderColor: "#88ad40", boxShadow: "0 0 0 3px rgba(136,173,64,0.25)" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Teléfono</FormLabel>
                      <Input
                        value={form.phone}
                        onChange={onChange("phone")}
                        placeholder="Ej: 5962-1085"
                        bg="white"
                        borderRadius="xl"
                        borderColor="blackAlpha.200"
                        _focusVisible={{ borderColor: "#88ad40", boxShadow: "0 0 0 3px rgba(136,173,64,0.25)" }}
                      />
                      <FormHelperText>Lo usamos para coordinar tu entrega.</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email (opcional)</FormLabel>
                      <Input
                        value={form.email}
                        onChange={onChange("email")}
                        type="email"
                        placeholder="tu@email.com"
                        bg="white"
                        borderRadius="xl"
                        borderColor="blackAlpha.200"
                        _focusVisible={{ borderColor: "#88ad40", boxShadow: "0 0 0 3px rgba(136,173,64,0.25)" }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Dirección (opcional)</FormLabel>
                      <Input
                        value={form.address}
                        onChange={onChange("address")}
                        placeholder="Zona / colonia / referencias"
                        bg="white"
                        borderRadius="xl"
                        borderColor="blackAlpha.200"
                        _focusVisible={{ borderColor: "#88ad40", boxShadow: "0 0 0 3px rgba(136,173,64,0.25)" }}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>Mensaje</FormLabel>
                    <Textarea
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder="Ej: Quiero 2 aceites de oliva, 1 granola y 3 mantequillas de maní..."
                      bg="white"
                      rows={5}
                      borderRadius="xl"
                      borderColor="blackAlpha.200"
                      _focusVisible={{ borderColor: "#88ad40", boxShadow: "0 0 0 3px rgba(136,173,64,0.25)" }}
                    />
                    <FormHelperText>
                      Incluye productos, cantidades y si tienes fecha deseada.
                    </FormHelperText>
                  </FormControl>

                  <Button
                    type="submit"
                    bg="#88ad40"
                    color="white"
                    borderRadius="full"
                    _hover={{ bg: "#667e37" }}
                    size="lg"
                  >
                    Enviar
                  </Button>

                  <Text fontSize="xs" color="gray.500">
                    *Tu total final se confirma al procesar tu pedido según disponibilidad y lote.
                  </Text>
                </Stack>
              </Box>
            </CardBody>
          </Card>

          {/* RIGHT SIDE */}
          <Stack spacing={6}>
            <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
              <CardHeader pb={0}>
                <Heading size="md" color="#1b2b1f">
                  ¿Cómo funciona?
                </Heading>
                <Text color="gray.600" fontSize="sm" mt={1}>
                  Un proceso simple para que compres sin complicaciones.
                </Text>
              </CardHeader>

              <CardBody>
                <Stack spacing={4}>
                  <Step
                    icon={FaShoppingBasket}
                    title="1) Elige productos"
                    desc="Explora el catálogo y envíanos tu lista (producto + cantidad)."
                  />
                  <Step
                    icon={FaWhatsapp}
                    title="2) Confirmamos disponibilidad"
                    desc="Te respondemos con total, tiempos y fecha estimada de entrega."
                  />
                  <Step
                    icon={FaClock}
                    title="3) Preparación y entrega"
                    desc="Preparamos tu pedido y coordinamos entrega en la fecha acordada."
                  />
                </Stack>
              </CardBody>
            </Card>

            <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="blackAlpha.100">
              <CardHeader pb={0}>
                <Heading size="md" color="#1b2b1f">
                  Información
                </Heading>
              </CardHeader>

              <CardBody>
                <Stack spacing={3}>
                  <HStack spacing={3}>
                    <Icon as={FaMapMarkerAlt} color="#636E52" />
                    <Text color="gray.700" fontSize="sm">
                      {LOCATION}
                    </Text>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FaClock} color="#636E52" />
                    <Text color="gray.700" fontSize="sm">
                      {HOURS}
                    </Text>
                  </HStack>

                  <Divider />

                  <Text color="gray.600" fontSize="sm">
                    Si necesitas algo específico (marcas, tamaños o sustitutos), dínoslo y te damos
                    opciones.
                  </Text>

                  <Button
                    as="a"
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    leftIcon={<Icon as={FaWhatsapp} />}
                    variant="outline"
                    borderRadius="full"
                    borderColor="blackAlpha.300"
                    _hover={{ bg: "blackAlpha.50" }}
                  >
                    Cotizar por WhatsApp
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function ContactCard({ icon, title, subtitle, value, accent, buttonLabel, onClick, variant = "solid" }) {
  const isSolid = variant === "solid";

  return (
    <Box
      position="relative"
      borderRadius="2xl"
      bg="white"
      boxShadow="sm"
      border="1px solid"
      borderColor="blackAlpha.100"
      overflow="hidden"
      _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
      transition="all 0.2s ease"
    >
      {/* Glow */}
      <Box
        position="absolute"
        inset="-40px"
        bgGradient={`radial(at top left, ${accent}33 0px, transparent 60%)`}
        pointerEvents="none"
      />

      <Box position="relative" p={6}>
        <HStack justify="space-between" align="flex-start">
          <HStack spacing={3}>
            <Box
              w="44px"
              h="44px"
              borderRadius="16px"
              display="grid"
              placeItems="center"
              bgGradient={`linear(to-br, ${accent}22, ${accent}55)`}
              border="1px solid"
              borderColor={`${accent}55`}
            >
              <Icon as={icon} color={accent} boxSize={5} />
            </Box>

            <Box>
              <Text fontWeight="900" color="#1b2b1f" lineHeight="1.1">
                {title}
              </Text>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {subtitle}
              </Text>
            </Box>
          </HStack>

          <Badge
            borderRadius="full"
            px={3}
            py={1}
            bg="green.50"
            color="green.700"
            fontSize="xs"
            fontWeight="800"
          >
            Disponible
          </Badge>
        </HStack>

        <Text mt={4} fontSize="sm" color="gray.600">
          {title === "WhatsApp"
            ? "La forma más rápida para cotizar y confirmar disponibilidad."
            : title === "Teléfono"
              ? "Si prefieres llamar, te atendemos en horario de tienda."
              : "También puedes solicitar cotizaciones y listas por correo."}
        </Text>

        <HStack justify="space-between" mt={4} align="center">
          <Text fontSize="sm" fontWeight="800" color="#1b2b1f">
            {value}
          </Text>

          <Button
            onClick={onClick}
            borderRadius="full"
            size="sm"
            bg={isSolid ? accent : "transparent"}
            color={isSolid ? "white" : accent}
            border={isSolid ? "none" : "1px solid"}
            borderColor={isSolid ? "transparent" : `${accent}55`}
            _hover={isSolid ? { filter: "brightness(0.95)" } : { bg: `${accent}14` }}
          >
            {buttonLabel}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

function Step({ icon, title, desc }) {
  return (
    <HStack align="flex-start" spacing={4}>
      <Box
        w="42px"
        h="42px"
        borderRadius="14px"
        bg="blackAlpha.50"
        display="grid"
        placeItems="center"
        flexShrink={0}
      >
        <Icon as={icon} color="#88ad40" boxSize={5} />
      </Box>
      <Box>
        <Text fontWeight="900" color="#1b2b1f">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {desc}
        </Text>
      </Box>
    </HStack>
  );
}
