type THandleProduct<Input> = {
  method: "POST" | "PUT" | "DELETE";
  productId?: string;
  data?: Input;
};

export const handleProduct = async <Input>({
  method,
  data,
  productId,
}: THandleProduct<Input>): Promise<Response> => {
  let url = "/api/products";
  if (productId && (method === "PUT" || method === "DELETE")) {
    url += `/${productId}`;
  }

  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: method === "POST" || method === "PUT" ? JSON.stringify(data) : undefined,
  });
};
