import express from 'express'
import http from 'http'
import {WebSocketServer} from 'ws'
import {handleRequests} from './handle-requests.js'

const app = express()
app.use(express.static('app'))
const port = process.env.PORT || 3000

const server = http.createServer(app)
export const wss = new WebSocketServer({server, path: '/echo'})

wss.on('connection', (ws) => {
    handleRequests['hello'](ws)

    ws.on('message', async (rawMsg) => {
        try {
            const msg = JSON.parse(rawMsg)
            console.log('received:', msg)

            await handleRequests[msg.type](ws, msg)

        } catch (err) {
            if (err instanceof SyntaxError) {
                console.log('received message is not valid JSON')
            } else {
                console.log(err)
            }
        }
    })
});



app.get('/', function (req, res) {
    res.sendFile('home.html', {root: 'app'})
})

app.get('/song-request', function (req, res) {
    res.sendFile('song-request.html', {root: 'app'})
})

app.get('/dashboard', function (req, res) {
    res.sendFile('dashboard.html', {root: 'app'})
})

server.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});

