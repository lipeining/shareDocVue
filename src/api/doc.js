import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    getDocOps
  };
  const getDocOps = get.bind(null, '/api/v1/doc/ops');
//   const login = get.bind(null, '/api/v1/login');