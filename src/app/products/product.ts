export interface IProduct {
  id: string;
  name: string;
  manufacturer?: string;
  description?: string;
  articleType: string;
  country?: string;
  price: number;
  rating?: number;
  imageUrl?: string;
  outOfStock: boolean;
  slug: string;
  publishedAt?: Date;
}

export interface IProductSaved extends IProduct {
  amount: number;
}
