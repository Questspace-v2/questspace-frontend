import { BACKEND_URL, FRONTEND_URL } from '@/app/api/client/constants';

const API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : BACKEND_URL;

export const localHeaders = new Headers([['Origin', FRONTEND_URL]]);

export default API_URL;
