import {
    get,
    post,
    put,
    del
  } from './helper';
  
  export {
    getChats,
  };
  const getChats = get.bind(null, '/api/v1/chats');