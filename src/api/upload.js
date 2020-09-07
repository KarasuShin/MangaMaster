import request from '@/utils/request';

// eslint-disable-next-line import/prefer-default-export
export const uploadCover = (file) => {
  const data = new FormData();
  data.append('file', file);
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };
  return request.post('/upload/cover', data, config);
};
