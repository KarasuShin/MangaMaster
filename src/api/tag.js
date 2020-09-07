import request from '@/utils/request';

export const fetchTag = (params) =>
  request.get('/tag', {
    params,
  });
export const createTag = (data) => request.post('/tag', data);
