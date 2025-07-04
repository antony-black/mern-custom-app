import { Center } from "@chakra-ui/react";

type TErrorPageComponent = {
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

export const ErrorPageComponent: React.FC<TErrorPageComponent> = ({ title = "Oops, error", children }) => {
  return <Center title={title}>{children}</Center>;
};
