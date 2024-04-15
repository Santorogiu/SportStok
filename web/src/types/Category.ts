import { Product } from "./Product";

export interface Category {
  id: string;
  name: string;
  products?: Product[];
}
