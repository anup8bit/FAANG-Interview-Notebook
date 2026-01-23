import { ReactElement } from "react";
import { ProductType } from "./types"
import Card, { CardProps } from "../../Components/Card";
import LazyImage from "../../Components/LazyImage";

interface ProductProps {
  productData: ProductType;
  key: string;
  id?: string;
  className?: string;
  testId?: string;
}

const Product = ({
  productData,
  key,
  id,
  className,
  testId,
}: ProductProps): ReactElement | null => {
  const cardProps: CardProps = {
    title: productData.title,
    subTitle: productData.brand,
    footerElement: productData.price,
  }

  console.log("productData from comp : ", productData);
  return (
    <Card {...cardProps}>
      <LazyImage src={productData?.images[0] ?? ""} alt="product image" />
    </Card>
  )
}

export default Product;