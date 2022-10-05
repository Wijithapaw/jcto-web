export interface ListItem {
  id: string;
  label: string;
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
  [key: string]: string;
}

export interface IDictionary<T> {
  [key: string]: T;
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
  status: number;
  message: string;
}

export interface EntityCreateResult {
  id: string;
  concurrencyKey: string;
}

export interface EntityUpdateResult {
  concurrencyKey: string;
}

export interface AuditedEntity {
  createdBy?: string;
  createdDateUtc?: string;
  lastUpdatedBy?: string;
  lastUpdatedDateUtc?: string;
}

export enum NotificationType { 'error', 'success', 'warning' }