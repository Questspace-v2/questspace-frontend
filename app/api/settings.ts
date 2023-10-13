const API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '';

export const localHeaders = new Headers([['Origin', 'localhost']]);

export default API_URL;
