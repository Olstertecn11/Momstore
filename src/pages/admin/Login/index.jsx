import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { EmailIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { LuLogIn } from "react-icons/lu";
import loginBG from "../../../assets/images/login_bg.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { handleChange } from "../../../utils/events";
import { useAuth } from "../../../auth/AuthContext";

export default function GlassLogin() {
  const location = useLocation();
  const isAdminLogin = location.pathname.includes("/admin/inicio-sesion");

  const loginTitle = isAdminLogin ? "Login administrativo" : "Inicia sesión o crea una cuenta";
  const loginSubtitle = isAdminLogin ? "Bienvenido al panel de administración. " : "";

  const emptyForm = { email: "", password: "" };
  const [formData, setFormData] = React.useState(emptyForm);

  // mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClick = () => setShowPassword((v) => !v);

  const { login } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      nav("/admin/ordenes", { replace: true });
    } catch (err) {
      toast({
        title: "Credenciales inválidas",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Center h="100vh" bgImage={`url('${loginBG}')`} bgSize="cover">
      <Box
        p={10}
        borderRadius="3xl"
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(15px)"
        border="1px solid rgba(255, 255, 255, 0.3)"
        boxShadow="2xl"
        width={{ base: "90%", md: "450px" }}
        textAlign="center"
      >
        <VStack spacing={6}>
          <Center bg="white" p={3} borderRadius="xl" boxShadow="sm" mb={2}>
            <LuLogIn size="24px" />
          </Center>

          <Box>
            <Heading size="md" fontWeight="800" mb={2}>
              {loginTitle}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {loginSubtitle}
            </Text>
          </Box>

          {/* ✅ ahora sí hace submit */}
          <Box as="form" w="100%" onSubmit={onSubmit}>
            <Stack spacing={3} w="100%">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Correo"
                  variant="filled"
                  name="email"
                  value={formData.email} // ✅ controlado
                  onChange={(e) => handleChange(e, setFormData)}
                  bg="rgba(0,0,0,0.05)"
                  _focus={{ bg: "white", borderColor: "blue.400" }}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  name="password"
                  value={formData.password} // ✅ controlado
                  onChange={(e) => handleChange(e, setFormData)}
                  variant="filled"
                  bg="rgba(0,0,0,0.05)"
                  _focus={{ bg: "white", borderColor: "blue.400" }}
                />
                <InputRightElement h="full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClick}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    type="button" // ✅ evita submit accidental
                  >
                    {showPassword ? (
                      <ViewIcon color="gray.400" />
                    ) : (
                      <ViewOffIcon color="gray.400" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <Text fontSize="xs" textAlign="right" fontWeight="600" cursor="pointer">
                ¿Olvidaste tu contraseña?
              </Text>

              <Button
                type="submit"              // ✅ submit real
                isLoading={loading}        // ✅ loading real
                isDisabled={loading}       // ✅ evita doble click
                bg="black"
                color="white"
                size="lg"
                _hover={{ bg: "gray.800" }}
                borderRadius="xl"
              >
                Iniciar sesión
              </Button>
            </Stack>
          </Box>

          {!isAdminLogin && (
            <VStack w="100%" spacing={4}>
              <HStack w="100%" px={4}>
                <Divider borderColor="gray.400" />
                <Text fontSize="xs" whiteSpace="nowrap" color="gray.500">
                  O continúa con
                </Text>
                <Divider borderColor="gray.400" />
              </HStack>

              <Button
                w="100%"
                variant="outline"
                size="lg"
                borderRadius="xl"
                borderColor="gray.300"
                _hover={{ bg: "gray.50" }}
              >
                Crear una cuenta
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Center>
  );
}
