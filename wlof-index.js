const init = async() => {
    const step = [getEnvironment, createHttpWeb, createWebsocket, createHttpServer]

    const ENV = step[0]()

    if (ENV === 'development') {
        const httpWebInstance = await step[1]();
        this.httpWeb = httpWebInstance.data
        if (httpWebInstance.result !== 1) return console.error(`build http web error ${httpWebInstance.message}`);
        console.log('http web create successful');
    }

    const websocketInstance = await step[2]();
    this.websocke = websocketInstance.data
    if (websocketInstance.result !== 1) {
        if (ENV === 'development') this.httpWeb.close();
        return console.error(`build websocket error ${websocketInstance.message}`);
    }
    console.log('websocke create successful');

    const httpServerInstance = await step[3](this.websocke);
    if (httpServerInstance.result !== 1) {
        this.websocke.close()
        if (ENV === 'development') this.httpWeb.close();
        return console.error(`build websocket error ${httpServerInstance.message}`);
    }
    console.log('http server create successful');
}

const getEnvironment = () => {
    const environmentConfig = ['development', 'production']
    const commandString = process.argv[2]
    const NODE_ENV = commandString.split('=')[1]

    return NODE_ENV
}

init();