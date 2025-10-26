export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// === НОВЫЕ ТИПЫ ДЛЯ МОДЕЛЕЙ ДАННЫХ ===

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// === ТИПЫ ДЛЯ РАБОТЫ С СЕРВЕРОМ ===

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

// === ТИПЫ ДЛЯ ГЛАВНОЙ СТРАНИЦЫ ===

export interface IPageState {
	cartCounter: number;
	catalog: HTMLElement[];
}

// === ТИПЫ ДЛЯ УВЕДОМЛЕНИЯ ОБ УСПЕХЕ ===

export interface ISuccessData {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}