import { Category } from "./Category";

export interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  size?: number;
  color: string;
  categoryId: string;
  category: Category;
  createdAt: Date;
}
