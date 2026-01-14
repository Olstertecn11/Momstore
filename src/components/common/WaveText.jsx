import { motion } from "framer-motion";
import { Heading } from "@chakra-ui/react";

const WaveText = ({ text, ...props }) => {
  // Configuración de la animación de cada letra
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Retraso entre cada letra
      },
    },
  };

  const letterVariants = {
    animate: {
      y: [0, -10, 0], // Movimiento de 10px hacia arriba y vuelve
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Heading
      as={motion.h1}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      {...props}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </Heading>
  );
};

export default WaveText;
