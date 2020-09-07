import request from '@/utils/request';

export const fetchAuthor = (params) =>
  request.get('/author', {
    params,
  });
export const createAuthor = (data) => request.post('/author', data);
export const searchAuthor = (params) =>
  request.get('/author/search', {
    params,
  });
