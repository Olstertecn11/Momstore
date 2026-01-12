import {
  Box,
  Heading,
  Text,
  HStack,
  Button,
  Badge,
  Image,
} from "@chakra-ui/react";
export default function ProductCard({ product, onOpenCatalog, addProduct }) {
  const available = product.stock > 0;

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      p={4}
      cursor="pointer"
      onClick={onOpenCatalog}
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      transition="all 0.2s ease"
    >
      <Box position="relative" borderRadius="xl" overflow="hidden" bg="gray.50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          w="100%"
          h="150px"
          objectFit="cover"
          fallback={<Box h="150px" />}
        />
        <Badge
          position="absolute"
          top="10px"
          left="10px"
          borderRadius="full"
          px={3}
          py={1}
          bg="blackAlpha.600"
          color="white"
          backdropFilter="blur(10px)"
          fontSize="xs"
        >
          {available ? "Disponible" : "Agotado"}
        </Badge>
      </Box>

      <Heading size="sm" color="#1b2b1f" mt={3} noOfLines={2}>
        {product.name}
      </Heading>
      <Text fontSize="xs" color="gray.600" mt={1} noOfLines={2}>
        {product.description}
      </Text>

      <HStack justify="space-between" mt={3}>
        <Text fontWeight="bold" color="#1b2b1f">
          Q{product.price.toFixed(2)}
        </Text>

        <Button
          size="sm"
          borderRadius="full"
          bg="#88ad40"
          color="white"
          _hover={{ bg: "#667e37" }}
          onClick={(e) => {
            e.stopPropagation();
            addProduct(product);
          }}
          isDisabled={!available}
        >
          {available ? "Agregar" : "Ver"}
        </Button>
      </HStack>
    </Box>
  );
}
