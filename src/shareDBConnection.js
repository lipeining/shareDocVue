let sharedb = require('sharedb/lib/client');
let richText = require('rich-text');
import  ReconnectingWebSocket from 'reconnecting-websocket';
sharedb.types.register(richText.type);
// Expose a singleton WebSocket connection to ShareDB server
let socket = new ReconnectingWebSocket('ws://localhost:5000/sharedb');
// socket.onerror = function sharedbSocketOnError(err) {
//     console.log('in shareDBConnection.js');
//     console.log(JSON.stringify(err));
// }
let shareDBConnection = new sharedb.Connection(socket);
export{shareDBConnection}
