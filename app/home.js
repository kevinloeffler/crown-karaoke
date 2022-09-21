/* VIEW */
const nowPlayingPlaceholder = document.querySelector('#now-playing-placeholder')
const nowPlayingDiv = document.querySelector('#now-playing-div')
const nowPlayingSongName = document.querySelector('#now-playing-song-name')
const nowPlayingArtist = document.querySelector('#now-playing-artist')
const nowPlayingSinger = document.querySelector('#now-playing-singer')

const queueWrapper = document.querySelector('#queue-wrapper')
const waitTimeIndicator = document.querySelector('#wait-time')

/* CONNECTION */

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

function sendSongRequest(request) {
    // ToDo: Send song request
    wsConnection.send({})
}

