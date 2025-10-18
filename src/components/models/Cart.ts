import { IProduct } from '../../types';

export class Cart {
  items: IProduct[] = [];

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(product: IProduct): void {
    this.items.push(product);
  }

  remove(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}