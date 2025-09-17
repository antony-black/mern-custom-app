import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navbar } from "components";
import { useRoutes } from "react-router-dom";
import { routes } from "routes";
import { appLogger } from "utils";

function App() {
  appLogger.info("Rendering application");

  const element = useRoutes(routes);

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />
      {element}
    </Box>
  );
}

export default App;
