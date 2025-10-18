import { IProduct } from '../../types';

export class Catalog {
  items: IProduct[] = [];
  selected: IProduct | null = null;

  setItems(products: IProduct[]): void {
    this.items = products;
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelected(product: IProduct): void {
    this.selected = product;
  }

  getSelected(): IProduct | null {
    return this.selected;
  }
}