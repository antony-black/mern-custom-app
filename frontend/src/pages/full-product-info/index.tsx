import { useParams } from "react-router-dom";
import { useProductStore } from "store/index";

function FullProductInfoPage() {
  const { id } = useParams();
  const { products } = useProductStore();

  const product = products.find((prod) => prod._id === id);

  if (!product) {
    return <div className="p-6 text-center">Loading product details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded-2xl"
      />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-xl text-gray-600 mt-2">${product.price}</p>
      <p className="mt-4 text-gray-700">Product ID: {product._id}</p>
    </div>
  );
}

export default FullProductInfoPage;
