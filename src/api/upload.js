import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    upload64
  };
  const upload64 = post.bind(null, '/api/v1/image/base64');