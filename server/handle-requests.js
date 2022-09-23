import {addSong, getQueue} from './database-manager.js'
import {wss} from './server.js'

export const handleRequests = {
    'hello': sendWelcomeMessage,
    'request-update': sendDataUpdate,
    'request-song': sendSongConfirmation,
}

function sendWelcomeMessage(websocket, request) {
    const welcomeMsg = JSON.stringify({type: 'hello', data: new Date()})
    websocket.send(welcomeMsg)
}

async function sendDataUpdate(websocket, request) {

    // ToDo: get songs from db

    const updateMsg = JSON.stringify({
        type: 'update',
        data: {songs: 'test'},
    })
    websocket.send(updateMsg)
}

async function sendBroadcast() {

    const queue = await getQueue()

    wss.clients.forEach(client => {
        const message = JSON.stringify({type: 'update', data: queue})
        client.send(message)
    })
}

setTimeout(sendBroadcast, 2000, 'Hello everyone')


async function sendSongConfirmation(websocket, request) {
    let confirmationMsg
    try {
        await addSong(request.id, request.data.title, request.data.artist, request.data.singer)
        confirmationMsg = JSON.stringify({
            type: 'song-confirmation',
            status: true,
            id: request.id,
        })
    } catch (err) {
        console.log(err)

        confirmationMsg = JSON.stringify({
            type: 'song-confirmation',
            status: false,
            id: request.id,
        })
    }
    websocket.send(confirmationMsg)
    await sendBroadcast()
}
