import { IProduct } from '@/types';
import { IEvents } from '@/components/base/Events';

export class Catalog {
  items: IProduct[] = [];
  selected: IProduct | null = null;
  private events?: IEvents;

  constructor(events?: IEvents) {
    this.events = events;
  }

  setItems(products: IProduct[]): void {
    this.items = products;
    this.events?.emit('catalog:change', {});
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelected(product: IProduct): void {
    this.selected = product;
    this.events?.emit('catalog:selected', { product });
  }

  getSelected(): IProduct | null {
    return this.selected;
  }
}