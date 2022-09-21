const wsConnection = new WebSocket('ws://localhost:3000/echo', )

wsConnection.onopen = function(rawMsg) {
    console.log('ws connection opened')
    wsConnection.send(JSON.stringify({hello: 'world'}))
}

wsConnection.onmessage = function(rawMsg) {
    const msg = JSON.parse(rawMsg.data)
    console.log('received:', msg)
    switch (msg.type) {
        case 'hello':
            console.log('received hello message')
            const response = {type: 'hello', status: 'ok'}
            wsConnection.send(JSON.stringify(response))
            break
        case 'update':
            console.log('received update message')
            break
        default:
            console.log('received unknown message')
    }
    // const time = new Date(msg.date)
    // const timeStr = time.toLocaleTimeString()



}
