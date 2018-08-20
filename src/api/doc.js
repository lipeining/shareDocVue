import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    createDoc,
    importDoc,
    getDocOps,
    addDocUser,
    getSelectDocs
  };
  const getDocOps = get.bind(null, '/api/v1/doc/ops');
  const createDoc = post.bind(null, '/api/v1/doc');
  const importDoc = post.bind(null, '/api/v1/doc/import');
  const addDocUser =  put.bind(null, '/api/v1/doc/user');
  const getSelectDocs = get.bind(null, '/api/v1/docs/name');
