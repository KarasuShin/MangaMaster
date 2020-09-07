import request from '@/utils/request';

export const fetchManga = (params) =>
  request.get('/manga', {
    params,
  });
export const fetchMangaDetail = (id) => request.get(`/manga/${id}`);
export const createManga = (data) => request.post('/manga', data);
export const updateManga = (data) => request.put('/manga', data);
export const delManga = (id) => request.delete(`/manga/${id}`);
