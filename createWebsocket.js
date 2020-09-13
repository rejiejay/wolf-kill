const WebSocket = require('./ws');

const init = () => new Promise(resolve => {
    const config = { port: 8796 } // https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
    const wss = new WebSocket.Server(config, () => resolve(consequencer.success()))
    webSocketServer.innstance = wss
})

const webSocketServer = {
    innstance: null,
    pool: {

    }
}