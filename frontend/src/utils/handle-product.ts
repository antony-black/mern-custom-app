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
  if (id) {
    url = `${url}/${id}`;
  }

  const isFormData = data instanceof FormData;

  const config: RequestInit = {
    method,
    body:
      method === "POST" || method === "PUT"
        ? isFormData
          ? (data as FormData)
          : JSON.stringify(data)
        : undefined,
  };

  if (!isFormData) {
    config.headers = { "Content-Type": "application/json" };
  }

  return fetch(url, config);
};
