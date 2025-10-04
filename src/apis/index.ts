// Barrel exports for the new API layer
export * from './config';
export * from './http';
export * from './client';
export * from './types';
export * from './chat';
export * from './postings';

// Backward compatibility: default export behaves like old `api` (axios instance)
import { http } from './http';
export default http;
