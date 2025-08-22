type THandleRequest<Input> = {
  method: "POST" | "PUT" | "DELETE";
  url?: string;
  data?: Input;
  id?: string;
};

export const handleRequest = async <Input>({
  method,
  url = "/api/products",
  data,
  id,
}: THandleRequest<Input>): Promise<Response> => {
  try {
    if (id) {
      url = `${url}/${id}`;
    }

    const isFormData = data instanceof FormData;

    const config: RequestInit = {
      method,
      body:
        method === "POST" || method === "PUT"
          ? isFormData
            ? data
            : JSON.stringify(data)
          : undefined,
    };

    if (!isFormData) {
      config.headers = { "Content-Type": "application/json" };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error("Failed to perform request.");
    }

    return response;
  } catch (error) {
    throw new Error(`Failed to perform request: ${error}`);
  }
};

// export const handleRequest = async <Input>({
//   method,
//   url = "/api/products",
//   data,
//   id,
// }: THandleRequest<Input>): Promise<Response> => {
//   if (id) {
//     url = `${url}/${id}`;
//   }

//   const isFormData = data instanceof FormData;

//   const config: RequestInit = {
//     method,
//     body:
//       method === "POST" || method === "PUT"
//         ? isFormData
//           ? data
//           : JSON.stringify(data)
//         : undefined,
//   };

//   if (!isFormData) {
//     config.headers = { "Content-Type": "application/json" };
//   }

//   try {
//     const response = await fetch(url, config);

//     if (!response.ok) {
//       throw new Error(`Request failed with status ${response.status}`);
//     }

//     return response;
//   } catch (error) {
//     throw new Error(
//       `Failed to perform request: ${error instanceof Error ? error.message : String(error)}`,
//     );
//   }
// };
