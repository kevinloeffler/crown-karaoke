let WS_URL
if (window.location.href === 'http://localhost:3000/dashboard') {
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
// const waitTimeIndicator = document.querySelector('#wait-time')

let currentlyPlayingID = null

function renderSongs(songs) {
    if (songs.length === 0) {
        currentlyPlayingID = null
        nowPlayingDiv.classList.add('hidden')
        nowPlayingPlaceholder.classList.remove('hidden')
    } else {
        // Visibility
        nowPlayingDiv.classList.remove('hidden')
        nowPlayingPlaceholder.classList.add('hidden')

        // Now playing song
        const nowPlayingSong = songs.shift()
        currentlyPlayingID = nowPlayingSong.song_id
        nowPlayingSongName.textContent = nowPlayingSong.song_name
        nowPlayingArtist.textContent = nowPlayingSong.artist_name
        nowPlayingSinger.textContent = nowPlayingSong.singer_name

        // Queue
        let fragment = ''
        for (const song of songs) {
            fragment += `<div class="song-wrapper song-wrapper-dashboard">
<div>
    <p class="song-title">${song.song_name}</p>
    <p>${song.artist_name} - ${song.singer_name}</p>
</div>
<div class="dashboard-button-wrapper">
    <div onclick="handleHideClick(${song.song_id})">Hide</div>
    <div onclick="handleDeleteClick(${song.song_id})">Delete</div>
</div>
</div>`
        }
        queueWrapper.innerHTML = fragment
    }
}

function renderWaitTime(songs_count) {
    waitTimeIndicator.textContent = `~ ${songs_count * 3} Min Wartezeit`
}

function renderUI(songs, songs_count) {
    renderSongs(songs)
    // renderWaitTime(songs_count)
}

/* MODEL */

const handleMessage = {
    'hello': handleHelloMsg,
    'update': handleUpdateMsg,
}

function handleHelloMsg(msg) {
    console.log(`Hello message received at ${msg.data}`)
    const requestUpdate = JSON.stringify({type: 'request-update', date: 'update request'})
    wsConnection.send(requestUpdate)
}

function handleUpdateMsg(msg) {
    console.log('Update received')
    renderUI(msg.data, msg.data.length)
}

function handlePlayedClick() {
    const playedMsg = JSON.stringify({type: 'mark-played', id: currentlyPlayingID})
    wsConnection.send(playedMsg)
}

function handleHideClick(songID) {
    console.log(songID)
   const hideMsg = JSON.stringify({type: 'hide-singer', id: songID})
    wsConnection.send(hideMsg)
}

function handleDeleteClick(songID) {
    const delMsg = JSON.stringify({type: 'delete-song', id: songID})
    wsConnection.send(delMsg)
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
}

