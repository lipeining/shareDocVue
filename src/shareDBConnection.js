let sharedb = require('sharedb/lib/client')
let richText = require('rich-text')
import  ReconnectingWebSocket from 'reconnecting-websocket'
sharedb.types.register(richText.type)
// Expose a singleton WebSocket connection to ShareDB server
let socket = new ReconnectingWebSocket('ws://localhost:5000/sharedb')
let shareDBConnection = new sharedb.Connection(socket)
export{shareDBConnection}
