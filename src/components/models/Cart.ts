import { IProduct } from '@/types';
import { IEvents } from '@/components/base/Events';

export class Cart {
  items: IProduct[] = [];
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(product: IProduct): void {
    if (product.price === null) {
      return;
    }
    this.items.push(product);
    this.events?.emit('cart:change', {});
  }

  remove(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events?.emit('cart:change', {});
  }

  clear(): void {
    this.items = [];
    this.events?.emit('cart:change', {});
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