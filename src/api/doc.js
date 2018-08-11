import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    createDoc,
    getDocOps,
    addDocUser
  };
  const getDocOps = get.bind(null, '/api/v1/doc/ops');
  const createDoc = post.bind(null, '/api/v1/doc');
  const addDocUser =  put.bind(null, '/api/v1/doc/user');
//   const login = get.bind(null, '/api/v1/login');