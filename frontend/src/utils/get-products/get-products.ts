type TGetProducts = {
  page?: number;
  limit?: number;
};

export const getProducts = async ({
  page = 1,
  limit = 6,
}: TGetProducts = {}): Promise<Response> => {
  return await fetch(`/api/products?page=${page}&limit=${limit}`, {
    method: "GET",
  });
};
