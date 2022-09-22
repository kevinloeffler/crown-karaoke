
export const handleRequests = {
    'hello': sendWelcomeMessage,
    'request-update': sendDataUpdate,
    'request-song': sendSongConfirmation,
}

function sendWelcomeMessage(websocket, request) {
    const welcomeMsg = JSON.stringify({type: 'hello', data: new Date()})
    websocket.send(welcomeMsg)
}

function sendDataUpdate(websocket, request) {

    // ToDo: get songs from db

    const updateMsg = JSON.stringify({
        type: 'update',
        data: {songs: 'test'},
    })
    websocket.send(updateMsg)
}

function sendSongConfirmation(websocket, request) {

    // ToDo: store song in db

    const confirmationMsg = JSON.stringify({
        type: 'song-confirmation',
        status: true,
        id: request.id,
    })
    websocket.send(confirmationMsg)
}
