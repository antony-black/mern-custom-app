// async () => await fetch(`/api/products?page=1&limit=6`);
type TGetProducts = {
  page?: number;
  limit?: number;
};

export const getProducts = async ({ page = 1, limit = 6 }: TGetProducts = {}) => {
  return await fetch(`/api/products?page=${page}&limit=${limit}`);
};
