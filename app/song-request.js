let WS_URL
if (window.location.href === 'http://localhost:3000/song-request') {
    WS_URL = 'ws://localhost:3000/echo'
} else {
    WS_URL = 'ws://crown-karaoke.herokuapp.com/echo'
}

/* VIEW */

const titleInput = document.querySelector('#title-input')
const artistInput = document.querySelector('#artist-input')
const singerInput = document.querySelector('#singer-input')

const overlay = document.querySelector('#overlay')
const overlayTitle = document.querySelector('#overlay-title')
const overlayArtist = document.querySelector('#overlay-artist')

const confirmSongButton = document.querySelector('#confirm-song-button')
confirmSongButton.addEventListener('click', handleButtonClick)

function renderOverlay(status) {
    if (status) {
        overlayTitle.textContent = songRequest.title
        overlayArtist.textContent = songRequest.artist
    } else {
        // ToDo: Handle error status
        console.log('Error: song was not added to wait list')
    }
}

/* MODEL */

const songRequest = {
    id: null,
    title: '',
    artist: '',
    singer: '',
}

const handleMessage = {
    'hello': handleHelloMsg,
    'song-confirmation': handleSongConfirmationMsg,
}

function handleHelloMsg(msg) {
    console.log(`Hello message received at ${msg.data}`)
}

function handleSongConfirmationMsg(msg) {
    console.log(`Song request confirmed, id: ${msg.id}`)
    if (msg.id === songRequest.id) {
        renderOverlay(msg.status)
    }
}

/* LOGIC */

function handleButtonClick() {
    if (!(titleInput.value === '' || artistInput.value === '')) {
        const requestID = Math.floor(Math.random() * 100_000)

        songRequest.id = requestID
        songRequest.title = titleInput.value
        songRequest.artist = artistInput.value
        songRequest.singer = singerInput.value

        const request = {
            type: 'request-song',
            id: requestID,
            data: {
                title: songRequest.title,
                artist: songRequest.artist,
                singer: songRequest.singer,
            }
        }
        sendSongRequest(request)
    } else {
        alert('Titel und Artist müssen ausgefüllt sein!')
    }
}

/* CONNECTION */

const wsConnection = new WebSocket(WS_URL)
wsConnection.addEventListener('message', handleWebsocketMessages)

function sendSongRequest(request) {
    wsConnection.send(JSON.stringify(request))
}

function handleWebsocketMessages(rawMsg) {
    try {
        const msg = JSON.parse(rawMsg.data)
        console.log('received:', msg)

        handleMessage[msg.type](msg)

    } catch (err) {
        console.log(err)
    }
}

