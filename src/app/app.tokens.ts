import { InjectionToken } from '@angular/core';

export const DOCUMENT = new InjectionToken<Document>('document token', {
  providedIn: 'root',
  factory: () => document
})
