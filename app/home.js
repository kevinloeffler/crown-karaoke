const wsConnection = new WebSocket('ws://localhost:3000/echo', )

wsConnection.onopen = function(rawMsg) {
    console.log('ws connection opened')
    wsConnection.send(JSON.stringify({type: 'hello'}))
}

wsConnection.onmessage = function(rawMsg) {
    try {
        const msg = JSON.parse(rawMsg.data)
        console.log('received:', msg)

        switch (msg.type) {
            case 'hello':
                console.log('received hello message')
                const response = {type: 'request', data: 'update'}
                wsConnection.send(JSON.stringify(response))
                break
            case 'update':
                console.log('received update message')
                break
            default:
                console.log('received unknown message')
        }
    } catch (err) {
        console.log('error:')
        console.log(err.name)
    }

    // const time = new Date(msg.date)
    // const timeStr = time.toLocaleTimeString()
}

function sendWS(content) {
    wsConnection.send({})
}

window.setTimeout()

