import { IApi } from '../../types';
import { IProduct, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class LarekAPI {
  constructor(private readonly api: IApi) {}

  async getProducts(): Promise<IProduct[]> {
    const response = await this.api.get<IProductsResponse>('/products');
    return response.items;
  }

  async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order', order);
  }
}