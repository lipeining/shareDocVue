import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    getMessages,
  };
  const getMessages = get.bind(null, '/api/v1/messages');