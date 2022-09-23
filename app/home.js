let WS_URL
console.log('cur:', window.location.href)
if (window.location.href === 'http://localhost:3000/') {
    WS_URL = 'ws://localhost:3000/echo'
} else {
    WS_URL = 'ws://crown-karaoke.herokuapp.com/echo'
}

console.log('WS URL:', WS_URL)

/* VIEW */

const nowPlayingPlaceholder = document.querySelector('#now-playing-placeholder')
const nowPlayingDiv = document.querySelector('#now-playing-div')
const nowPlayingSongName = document.querySelector('#now-playing-song-name')
const nowPlayingArtist = document.querySelector('#now-playing-artist')
const nowPlayingSinger = document.querySelector('#now-playing-singer')

const queueWrapper = document.querySelector('#queue-wrapper')
const waitTimeIndicator = document.querySelector('#wait-time')

/* MODEL */

const handleMessage = {
    'hello': handleHelloMsg,
    'broadcast': handleBroadcastMsg,
}

function handleHelloMsg(msg) {
    console.log(`Hello message received at ${msg.data}`)
}

function handleBroadastMsg(msg) {
    
}

/* CONNECTION */

const wsConnection = new WebSocket(WS_URL)

wsConnection.onopen = function(rawMsg) {
    console.log('ws connection opened')
}

wsConnection.onmessage = function(rawMsg) {
    try {
        const msg = JSON.parse(rawMsg.data)
        console.log('received:', msg)

        switch (msg.type) {
            case 'hello':
                console.log('received hello message')
                const response = {type: 'request-update', data: 'update request'}
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

