// src/components/views/Gallery.ts
import { Component } from '@/components/base/Component';

export class Gallery extends Component<IGalleryData> {
  private _list: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    // Контейнер — это и есть .gallery, используем его напрямую
    this._list = container;
  }

  set catalog(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }
}

interface IGalleryData {
  catalog: HTMLElement[];
}