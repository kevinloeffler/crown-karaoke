let WS_URL
if (window.location.href === 'http://localhost:3000/') {
    WS_URL = 'ws://localhost:3000/echo'
} else {
    WS_URL = 'wss://crown-karaoke.herokuapp.com/echo'
}

/* VIEW */

const nowPlayingPlaceholder = document.querySelector('#now-playing-placeholder')
const nowPlayingDiv = document.querySelector('#now-playing-div')
const nowPlayingSongName = document.querySelector('#now-playing-song-name')
const nowPlayingArtist = document.querySelector('#now-playing-artist')
const nowPlayingSinger = document.querySelector('#now-playing-singer')

const queueWrapper = document.querySelector('#queue-wrapper')
const waitTimeIndicator = document.querySelector('#wait-time')

function renderSongs(songs) {
    let fragment = ''

    for (const song of songs) {
        console.log(song)
        fragment += `<div class="song-wrapper"><p>${song.song_name}</p><p>${song.artist_name}</p></div>`
    }
    console.log(fragment)
    queueWrapper.innerHTML = fragment
}

function renderWaitTime(songs_count) {
    waitTimeIndicator.textContent = `~ ${songs_count * 3} Min Wartezeit`
}

/* MODEL */

const handleMessage = {
    'hello': handleHelloMsg,
    'update': handleUpdateMsg,
}

function handleHelloMsg(msg) {
    console.log(`Hello message received at ${msg.data}`)
}

function handleUpdateMsg(msg) {
    console.log('Update received')
    renderSongs(msg.data)
    renderWaitTime(msg.data.length)
}

/* CONNECTION */

const wsConnection = new WebSocket(WS_URL)

wsConnection.onopen = function(rawMsg) {
    console.log('ws connection opened')
}

wsConnection.onmessage = async (rawMsg) => {
    try {
        const msg = JSON.parse(rawMsg.data)
        await handleMessage[msg.type](msg, wsConnection)

    } catch (err) {
        if (err instanceof SyntaxError) {
            console.log('received message is not valid JSON')
        } else {
            console.log(err)
        }
    }


/*
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
*/
    // const time = new Date(msg.date)
    // const timeStr = time.toLocaleTimeString()
}

function sendSongRequest(request) {
    // ToDo: Send song request
    wsConnection.send({})
}

