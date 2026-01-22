interface Dimension {
  width: string;
  height: string;
  depth: string;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductType {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimension;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  reviews: Review[];
  meta: {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
  };
  images: string[],
  thumbnail: string;
};