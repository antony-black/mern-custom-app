import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Navbar />
      </Box>
    </>
  );
}

export default App;
