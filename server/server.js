import express from 'express'
import http from 'http'
import ws, {WebSocketServer} from 'ws'


const app = express()
app.use(express.static('app'))
const port = process.env.PORT || 3000


const server = http.createServer(app)
const wss = new WebSocketServer({server, path: '/echo'})

/*wss.on('connection', (ws) => {
    const welcomeMessage = JSON.stringify({type: 'hello', status: 'ok'})
    ws.send(welcomeMessage)
});*/

wss.on('message', (message) => {
    console.log(`received message: ${message}`)
})



app.get('/', function (req, res) {
    res.sendFile('home.html', {root: 'app'})
})



//start our server
server.listen(port, () => {
    console.log(`Server started on port ${server.address().port}`);
});


