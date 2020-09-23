export default WebSocket = {
    instance: null,

    reactComponent: null,

    init: function() {
        this.instance = await this.createWebsocket()
    },

    createWebsocket: function() { /** ... */ },

    bind: function(reactComponent) {
        this.reactComponent = reactComponent
    },

    // Connection opened
    initConnection: function() {},

    incomeHandle: function({ effectPage, effectMethod, data }) {
        if (effectPage !== this.reactComponent.name) return
        this.reactComponent[`WS_Income_${effectMethod}`](data)
    },
}