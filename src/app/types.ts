export interface ListItem {
  key: string;
  value: string;
  inactive?: boolean
}

export interface PagedFilter {
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  total: number;
  items: T[];
}

export interface PaginatorData {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface Dictionary {
  [key: string] : string;
}

export interface IDictionary<T> {
  [key: string] : T;
}

export interface AppNotification {
  type: NotificationType,
  message: string;
  title?: string;
  id: string;
}

export interface User {
  email: string;
  name: string;
}

export interface ErrorResponse {
  errorMessage: string;
}

export enum NotificationType { 'error' , 'success' , 'warning'}