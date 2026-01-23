import { useEffect, useState } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import { ProductType } from "./types";
import Product from "./Product";

const ProductList = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [page, setPage] = useState(0);

  const url = `https://dummyjson.com/products?limit=10&skip=${10*page}`;
  // console.log("url : ", url);

  const {data, loading, error} = useFetchData(url);

  // console.log("data, loading, error : ", data, loading, error)

  useEffect(() => {
    if (!data) return;
    console.log("products res : ", data.products);
    const updatedProducts = [...products, ...data?.products] as ProductType[];
    console.log(" updatedProducts: ", updatedProducts)
    setProducts(updatedProducts);
    // setTimeout(() => setPage(page+1), 3000)
  }, [data]);

  console.log("products", products);
  console.log("page : ", page);

  if (loading) return <div>Loading data......</div>

  return(
    <div>
      <header>
        <h3>Products</h3>
      </header>
      <div>
        {
          products?.map((product, index) =>(
            <Product key={product?.id?.toString()} productData={product} />
          ))
        }
      </div>
    </div>
  )
}

export default ProductList;