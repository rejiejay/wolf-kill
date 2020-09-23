export default WebSocket = {
    instance: null,

    pool: [],

    init: async function() {
        this.instance = await this.createWebsocket()
        this.initConnection(this.initPool, this.initHeartbeat)
    },

    createWebsocket: async function() {
        return new Promise(resolve => {
            const config = { port: 8796 } // https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
            new WebSocket.Server(config, instance => resolve(instance))
        })
    },

    initPool: async function(poolInstance, data) {
        const userInstance = this.getUserInforByMsg(data)
        this.pool[userInstance.id] = {
            poolInstance,
            timeOutCount: 0,
            hearbeatHandle: null,
        }
    },

    createNextHearbeatHandle: async function(poolInstance, userInstance) {
        const pool = this.pool[userInstance.id]

        pool.hearbeatHandle = setInterval(() => {
            pool.timeOutCount++
                poolInstance.send(clientHearbeatFlag)

            if (pool.timeOutCount > 3) {
                clearInterval(pool.hearbeatHandle);
            }
        }, 3000)
    },

    effectPreviousHearbeat: async function(poolInstance, userInstance) {
        const pool = this.pool[userInstance.id]
        pool.timeOutCount = 0
    },

    initHeartbeat: async function(poolInstance, data) {
        const userInstance = this.getUserInforByMsg(data)
        const isFirstHearbeat = this.getFirstHearbeat(data)

        if (isFirstHearbeat) return this.createNextHearbeatHandle(poolInstance, userInstance)

        this.effectPreviousHearbeat(poolInstance, userInstance)
    },

    initConnection: async function(initPool, initHeartbeat) {
        const self = this
        const incomingHandle = (poolInstance, message) => {
            const isOpenMsg = self.checkOpenMsg(message)
            const isHeartbeatMsg = self.checkHeartbeatMsg(message)

            if (isOpenMsg) initPool(poolInstance, JSON.stringify(message))
            if (isHeartbeatMsg) initHeartbeat(poolInstance, JSON.stringify(message))
        }
        const connectHandle = poolInstance => poolInstance.on('message', message => incomingHandle(poolInstance, message));

        this.instance.on('connection', connectHandle);
    },

    sendAll: async function({ effectPage, effectMethod, data }) {
        const slef = this
        const forEach = (pool, userId) => {
            slef.sendByPoolInstance({ poolInstance: pool.instance, effectPage, effectMethod, data })
        }
        _.mapKeys(this.pool, forEach)
    },

    sendByUserList: async function({ userList, effectPage, effectMethod, data }) {
        const slef = this
        userList.forEach(userId => {
            const poolInstance = slef.getPoolByUserId(userId)
            slef.sendByPoolInstance({ poolInstance, effectPage, effectMethod, data })
        })
    },

    sendByUserId: async function({ userId, effectPage, effectMethod, data }) {
        const poolInstance = this.getPoolByUserId(userId)
        this.sendByPoolInstance({ poolInstance, effectPage, effectMethod, data })
    },

    sendByPoolInstance: async function({ poolInstance, effectPage, effectMethod, data }) {
        poolInstance.send(JSON.stringify({ effectPage, effectMethod, data }));
    },
}