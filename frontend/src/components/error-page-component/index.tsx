import { Box } from "@chakra-ui/react";

type TErrorPageComponent = {
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

export const ErrorPageComponent: React.FC<TErrorPageComponent> = ({ title = "Oops, error", children }) => {
  return <Box title={title}>{children}</Box>;
};
