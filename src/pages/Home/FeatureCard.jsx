import {
  Box,
  Heading,
  Text,
} from "@chakra-ui/react";
export default function FeatureCard({ icon, title, desc }) {
  return (
    <Box bg="white" borderRadius="2xl" boxShadow="sm" p={6}>
      <Box fontSize="28px" mb={3}>
        {icon}
      </Box>
      <Heading size="sm" color="#1b2b1f" mb={2}>
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.600">
        {desc}
      </Text>
    </Box>
  );
}
