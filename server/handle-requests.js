import {addSong, deleteSong, getQueue, hideSinger, markSongAsPlayed} from './database-manager.js'
import {wss} from './server.js'

export const handleRequests = {
    'hello': sendWelcomeMessage,
    'request-update': sendDataUpdate,
    'request-song': sendSongConfirmation,
    'mark-played': markPlayed,
    'hide-singer': hide,
    'delete-song': deleteSongHere,
}

function sendWelcomeMessage(websocket, request) {
    const welcomeMsg = JSON.stringify({type: 'hello', data: new Date()})
    websocket.send(welcomeMsg)
}

async function sendDataUpdate(websocket, request) {

    const queue = await getQueue()

    const updateMsg = JSON.stringify({
        type: 'update',
        data: queue,
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

async function markPlayed(ws, msg) {
    await markSongAsPlayed(msg.id)
    await sendBroadcast()
}

async function hide(ws, msg) {
    await hideSinger(msg.id)
    await sendBroadcast()
}

async function deleteSongHere(ws, msg) {
    await deleteSong(msg.id)
    await sendBroadcast()
}

// setTimeout(sendBroadcast, 2000)


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
