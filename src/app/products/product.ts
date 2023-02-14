export interface IProduct {
  productId: number;
  name: string;
  manufacturer?: string;
  description?: string;
  articleType: string;
  price: number;
  rating?: number;
  imageUrl?: string;
  outOfStock: boolean;
  slug: string;
  publishedAt?: Date;
}
