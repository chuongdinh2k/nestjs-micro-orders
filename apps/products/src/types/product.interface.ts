import { Product } from '../schemas/product.schema';

export interface ListProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
